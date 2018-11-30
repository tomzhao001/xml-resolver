var fastCsv = require('fast-csv')
var fs = require('fs')

module.exports.writeNewCsv = writeNewCsv

function writeNewCsv (csvDataToWrite, csvPath) {
  return new Promise((resolve, reject) => {
    let csvStream = fastCsv.createWriteStream({headers: true})
    let csvWriteableStream = fs.createWriteStream(csvPath)
    csvWriteableStream.on('finish', () => {
      console.log('Write file successfully to: ' + csvPath)
      resolve(csvWriteableStream)
    })
    csvStream.pipe(csvWriteableStream)
    csvDataToWrite.forEach((csvMapRow) => {
      csvStream.write(csvMapRow)
    })
    csvStream.end()
  })
}
