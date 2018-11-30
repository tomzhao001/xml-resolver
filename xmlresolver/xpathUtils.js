var _ = require('lodash')
var xpath = require('xpath')
var constent = require('./const')

module.exports.mergeXPathWithHitCount = mergeXPathWithHitCount
module.exports.listFullXPathForEndNodes = listFullXPathForEndNodes

function mergeXPathWithHitCount (originalMapArray, newXPathList, vendorName) {
  newXPathList.forEach((newXPathString) => {
    let hitCount = 0
    originalMapArray.forEach((newCsvMap) => {
      if (String(_.get(newCsvMap, 'XPath')) === String(newXPathString)) {
        console.log('XPath hit !!!')
        _.set(newCsvMap, vendorName, String(Number(_.get(newCsvMap, vendorName)) + 1))
        hitCount++
      }
    })
    if (hitCount < 1) {
      let newCsvMapRow = '{'
      newCsvMapRow += '"' + constent.XPATH_HEADER + '":"' + newXPathString + '"'
      constent.VENDOR_HEADER_LIST.forEach((vendor) => {
        let defaultHitCount = (vendor === vendorName) ? '1' : '0'
        newCsvMapRow += ',"' + vendor + '":"' + defaultHitCount + '"'
      })
      newCsvMapRow += '}'
      console.log('New XPath found: ', newCsvMapRow)
      originalMapArray = _.concat(originalMapArray, JSON.parse(newCsvMapRow))
    }
  })
  console.log('New CSV Map Array: ', originalMapArray)
  return originalMapArray
}

function listFullXPathForEndNodes (domParser) {
  let newXPathList = []
  let nodes = xpath.evaluate('//*', domParser, null, xpath.XPathResult.ANY_TYPE, null)
  let currentNode = nodes.iterateNext()
  let index = 0
  while (currentNode) {
    // localName: 返回当前节点的名称或指定节点集中的第一个节点 - 不带有命名空间前缀。
    // firstChild: 节点下面的值
    if (currentNode.firstChild && String(currentNode.firstChild).trim() !== '') {
      // Root node found!!
      newXPathList[index] = appendParentXPath(currentNode)
      index++
    }
    currentNode = nodes.iterateNext()
  }
  console.log('newXPath = ', newXPathList)
  return newXPathList
}

function appendParentXPath (node) {
  if (node.parentNode.localName && node.parentNode.localName.trim() !== '') {
    // console.log('Found parent node: ' + node.parentNode.localName);
    return appendParentXPath(node.parentNode) + '/' + node.localName
  } else {
    // console.log('Found top node: ' + node.localName);
    return '/' + node.localName
  }
}
