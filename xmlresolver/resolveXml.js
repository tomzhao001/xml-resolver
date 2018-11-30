
var _ = require('lodash')
var fileRead = require('./fileRead')
var fileWrite = require('./fileWrite')
var constent = require('./const')
var xpathUtils = require('./xpathUtils')

module.exports.executeXml = executeXml

async function executeXml (xmlPath, csvPath, vendorName) {
  // Validate vendorName
  if (!_.includes(constent.VENDOR_HEADER_LIST, vendorName)) {
    console.log('Incorrect Vendor Name')
    return
  }

  // STEP 1: Read previous CSV data, it will be the base of the new CSV
  console.log('Start STEP 1: Read previous CSV data, it will be the base of the new CSV')
  let newCsvMapArray = await fileRead.readPreviousCsvFileReturnArray(csvPath)

  // STEP 2:  Read new XML File
  console.log('Start STEP 2:  Read new XML File')
  let xmldom = await fileRead.readAndParseXmlFile(xmlPath)

  // STEP 3: List Full XPath with all end nodes
  console.log('Start STEP 3: List Full XPath with all end nodes')
  let newXPathList = xpathUtils.listFullXPathForEndNodes(xmldom)

  // STEP 4: Compare current xpath and previous xpath (newXPathMapArray)
  console.log('Start STEP 4: Compare current xpath and previous xpath (newXPathMapArray)')
  newCsvMapArray = xpathUtils.mergeXPathWithHitCount(newCsvMapArray, newXPathList, vendorName)

  // STEP 5: Write the new CSV map array back to the CSV file
  console.log('Start STEP 5: Write the new CSV map array back to the CSV file')
  await fileWrite.writeNewCsv(newCsvMapArray, csvPath)
}
