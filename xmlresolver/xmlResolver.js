const _ = require('lodash');
const fs = require('fs');
const fileUtils = require('./fileUtils');
const config = require('./config');
const xpathUtils = require('./xpathUtils');

async function resolveXmlsFromConfig (configObj) {
  fs.readdir(configObj.xmlInputPath, (err, files) => {
    if (err) {
      throw err;
    }
    resolveXmlsFromList(files);
  });
}

async function resolveXmlsFromList (xmlFileList, csvHeader, vendorNameList) {
  /**
   * Push async functions into a FunctionList, 
   * and use async.series to pop out and execute them.
   */
  xmlFileList.forEach((xmlFileName) => {
    xmlExecFuncList.push(async () => {
      console.log('Start resolving the xml: ' + xmlFileName + ', Vendor Name: ' + csvHeader.vendorName);
      await this.resolveXml(xmlFileName, csvPath, csvHeader, vendorNameList);
      return xmlFileName;
    });
  });
  async.series(xmlExecFuncList, (err, results) => {
    if (!err) {
      console.log('Finish processing with results: ' + results);
    }
  });
}

async function resolveXml (xmlPath, csvPath, csvHeader, vendorNameList) {
  // Validate vendorName
  if (!_.includes(vendorNameList, csvHeader.vendorName)) {
    console.log(`Incorrect Vendor Name: ${csvHeader.vendorName}, please check the config file.`);
    return;
  }

  // STEP 1: Read previous CSV data, it will be the base of the new CSV
  console.log('Start STEP 1 of 5: Read previous CSV data, it will be the base of the new CSV');
  let newCsvMapArray = await fileUtils.readPreviousCsvFileAndReturnCscMappedArray(csvPath);

  // STEP 2:  Read new XML File
  console.log('Start STEP 2 of 5:  Read new XML File');
  let xmldom = await fileUtils.readAndParseXmlFile(xmlPath);

  // STEP 3: List Full XPath with all end nodes
  console.log('Start STEP 3 of 5: List Full XPath with all end nodes');
  let newXPathList = xpathUtils.listFullXPathForEndNodes(xmldom);

  // STEP 4: Compare current xpath and previous xpath (newXPathMapArray)
  console.log('Start STEP 4 of 5: Compare current xpath and previous xpath (newXPathMapArray)');
  newCsvMapArray = xpathUtils.updateCsvMapArrayWithNewXPath(newCsvMapArray, newXPathList, vendorName);

  // STEP 5: Write the new CSV map array back to the CSV file
  console.log('Start STEP 5 of 5: Write the new CSV map array back to the CSV file');
  await fileUtils.writeToCsv(newCsvMapArray, csvPath);
}

module.exports.resolveXml = resolveXml;
