const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const fileUtils = require('./fileUtils');
const xpathUtils = require('./xpathUtils');

async function resolveXmlsFromConfig (configObj) {
  fs.readdir(configObj.xmlInputPath, (err, files) => {
    if (err) {
      throw err;
    }
    resolveXmlsFromList(files, configObj);
  });
}

async function resolveXmlsFromList (xmlFileList, configObj) {
  let xmlExecFuncList;
  /**
   * Push async functions into a FunctionList, 
   * and use async.series to pop out and execute them.
   */
  xmlFileList.forEach((xmlFileName) => {
    xmlExecFuncList.push(async () => {
      console.log('Start resolving the xml: ' + xmlFileName + ', Vendor Name: ' + configObj.csvHeader.vendorName);
      await resolveXml(xmlFileName, configObj);
      return xmlFileName;
    });
  });
  async.series(xmlExecFuncList, (err, results) => {
    if (!err) {
      console.log('Finish processing with results: ' + results);
    }
  });
}

async function resolveXml (xmlFileName, configObj) {
  // Validate vendorName
  if (!_.includes(configObj.vendorNameList, configObj.csvHeader.vendorName)) {
    console.log(`Incorrect Vendor Name: ${configObj.csvHeader.vendorName}, please check the config file.`);
    return;
  }

  // STEP 1: Read previous CSV data, it will be the base of the new CSV
  console.log('Start STEP 1 of 5: Read previous CSV data, it will be the base of the new CSV');
  let newCsvMapArray = await fileUtils.readPreviousCsvFileAndReturnCsvMappedArray(configObj.csvOutputPath);

  // STEP 2:  Read new XML File
  console.log('Start STEP 2 of 5:  Read new XML File');
  let xmldom = await fileUtils.readAndParseXmlFile(configObj.xmlInputPath);

  // STEP 3: List Full XPath with all end nodes
  console.log('Start STEP 3 of 5: List Full XPath with all end nodes');
  let newXPathList = xpathUtils.listFullXPathForEndNodes(xmldom);

  // STEP 4: Compare current xpath and previous xpath (newXPathMapArray)
  console.log('Start STEP 4 of 5: Compare current xpath and previous xpath (newXPathMapArray)');
  newCsvMapArray = xpathUtils.updateCsvMapArrayWithNewXPath(newCsvMapArray, newXPathList, configObj);

  // STEP 5: Write the new CSV map array back to the CSV file
  console.log('Start STEP 5 of 5: Write the new CSV map array back to the CSV file');
  await fileUtils.writeToCsv(newCsvMapArray, configObj.csvOutputPath);
}

module.exports.resolveXmlsFromConfig = resolveXmlsFromConfig;
