const fs = require('fs');
const fastCsv = require('fast-csv');
const DOMParser = require('xmldom').DOMParser;
const _ = require('lodash');

async function readPreviousCsvFileAndReturnCsvMappedArray (csvOutputPath) {
  return new Promise((resolve, reject) => {
    let csvMapArray = [];
    if (fs.existsSync(csvOutputPath)) {
      let csvReadStream = fs.createReadStream(csvOutputPath);
      let csvStream = fastCsv({
        headers: true
      }).on('data', (fastCsvData) => {
        csvMapArray = _.concat(csvMapArray, fastCsvData);
      }).on('end', () => {
        console.log('CSV Read Done!\n', csvMapArray);
        resolve(csvMapArray);
      });
      csvReadStream.pipe(csvStream);
    } else {
      // TODO: If not exist, create a new csv file
      reject(new Error(`CSV not found in path ${csvOutputPath}`));
    }
  });
}

async function readAndParseXmlFile (xmlInputPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(xmlInputPath, 'utf-8', (err, inputXmlData) => {
      if (err) {
        reject(err);
      }
      let myLocator = {};
      let xmlParseErrorMessage = new Map();
      let xmldom = new DOMParser({
        locator: myLocator,
        errorHandler: {
          warning: (msg) => { xmlParseErrorMessage.set('warning', msg); },
          error: (msg) => { xmlParseErrorMessage.set('error', msg); },
          fatalError: (msg) => { xmlParseErrorMessage.set('fatalError', msg); }
        }
      }).parseFromString(inputXmlData);
      // Show XML Parse Error Message
      if (_.size(xmlParseErrorMessage) > 0) {
        console.error('xmlParseErrorMessage: ', xmlParseErrorMessage);
        reject(xmlParseErrorMessage);
      }
      resolve(xmldom);
    });
  });
}

async function writeToCsv (csvDataToWrite, csvPath) {
  return new Promise((resolve, reject) => {
    let csvStream = fastCsv.createWriteStream({headers: true});
    let csvWriteableStream = fs.createWriteStream(csvPath);
    csvWriteableStream.on('finish', () => {
      console.log('Write file successfully to: ' + csvPath);
      resolve(csvWriteableStream);
    })
    csvStream.pipe(csvWriteableStream);
    csvDataToWrite.forEach((csvMapRow) => {
      csvStream.write(csvMapRow);
    });
    csvStream.end();
  })
}

module.exports.readPreviousCsvFileAndReturnCsvMappedArray = readPreviousCsvFileAndReturnCsvMappedArray;
module.exports.readAndParseXmlFile = readAndParseXmlFile;
module.exports.writeToCsv = writeToCsv;
