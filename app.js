
var xmlExecutor = require('./xmlresolver/resolveXml')
var async = require('async')

let xmlPathList = [
  './xml/testFile-0.xml',
  './xml/testFile-1.xml',
  './xml/testFile-2.xml',
  './xml/testFile-3.xml'
]
let csvPath = './resolveResults.csv'
let vendorName = 'Vendor B'

console.log('Start programme.....')

let xmlExecFuncList = []

for (let i = 0; i < xmlPathList.length; i++) {
  console.log('xmlPath', xmlPathList[i])
  xmlExecFuncList.push(async () => {
    console.log('Start resolving the xml: ' + xmlPathList[i] + ', Vendor Name: ' + vendorName)
    await xmlExecutor.executeXml(xmlPathList[i], csvPath, vendorName)
    return xmlPathList[i]
  })
}

async.series(xmlExecFuncList, (err, results) => {
  if (!err) {
    console.log('Finish processing with results: ' + results)
  }
})
