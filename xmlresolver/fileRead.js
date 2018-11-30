var fs = require('fs')
var fastCsv = require('fast-csv')
var DOMParser = require('xmldom').DOMParser
var _ = require('lodash')

module.exports.readPreviousCsvFileReturnArray = readPreviousCsvFileReturnArray
module.exports.readAndParseXmlFile = readAndParseXmlFile

function readPreviousCsvFileReturnArray (inputCsvPath) {
  let csvMapArray = []
  return new Promise((resolve, reject) => {
    if (fs.existsSync(inputCsvPath)) {
      let csvReadStream = fs.createReadStream(inputCsvPath)
      let csvStream = fastCsv({headers: true}).on('data', (fastCsvData) => {
        csvMapArray = _.concat(csvMapArray, fastCsvData)
        // console.log('csvData = ' + fastCsvData);
        // console.log(csvMapArray);
      }).on('end', () => {
        console.log('CSV Read Done!\n', csvMapArray)
        resolve(csvMapArray)
      })
      csvReadStream.pipe(csvStream)
    } else {
      reject(new Error('CSV Not Found'))
    }
  })
}

function readAndParseXmlFile (inputXmlPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputXmlPath, 'utf-8', (err, inputXmlData) => {
      if (err) {
        throw err
      }
      let myLocator = {}
      let xmlParseErrorMessage = new Map()
      let xmldom = new DOMParser({
        locator: myLocator,
        errorHandler: {
          warning: (msg) => { xmlParseErrorMessage.set('warning', msg) },
          error: (msg) => { xmlParseErrorMessage.set('error', msg) },
          fatalError: (msg) => { xmlParseErrorMessage.set('fatalError', msg) }
        }
      }).parseFromString(inputXmlData)
      // Show XML Parse Error Message
      if (_.size(xmlParseErrorMessage) > 0) {
        console.error('xmlParseErrorMessage: ', xmlParseErrorMessage)
        throw xmlParseErrorMessage
      }
      resolve(xmldom)
    })
  })
}
