const _ = require('lodash');
const xpath = require('xpath');

function updateCsvMapArrayWithNewXPath (currentCsvMapArray, newXPathList, configObj) {
  let vendorName = configObj.csvHeader.vendorName;
  newXPathList.forEach((newXPathString) => {
    let hitTimes = 0;
    currentCsvMapArray.forEach((csvMap) => {
      if (String(_.get(csvMap, 'XPath')) === String(newXPathString)) {
        console.log('XPath already exist, hit times + 1');
        _.set(csvMap, vendorName, String(Number(_.get(csvMap, vendorName)) + 1));
        hitTimes++;
      }
    });
    if (hitTimes < 1) {
      let newCsvMapRow = '{"XPath": "' + newXPathString + '"';
      configObj.vendorNameList.forEach((vendor) => {
        newCsvMapRow += ',"' + vendor + '":"' + (vendor === vendorName) ? '1' : '0' + '"';
      });
      newCsvMapRow += '}';
      console.log(`New XPath found: ${newCsvMapRow}`);
      let currentCsvMapArray = _.concat(currentCsvMapArray, JSON.parse(newCsvMapRow));
    }
  });
  console.log(`CSV Map Array Updated: ${currentCsvMapArray}`);
  return currentCsvMapArray;
}

function listFullXPathForEndNodes (domParser) {
  let newXPathList = [];
  let nodes = xpath.evaluate('//*', domParser, null, xpath.XPathResult.ANY_TYPE, null);
  let currentNode = nodes.iterateNext();
  let index = 0;
  while (currentNode) {
    // localName: 返回当前节点的名称或指定节点集中的第一个节点 - 不带有命名空间前缀。
    // firstChild: 节点下面的值
    if (currentNode.firstChild && String(currentNode.firstChild).trim() !== '') {
      // Root node found!!
      newXPathList[index] = appendParentXPath(currentNode);
      index++;
    }
    currentNode = nodes.iterateNext();
  }
  return newXPathList;
}

function appendParentXPath (node) {
  if (node.parentNode.localName && node.parentNode.localName.trim() !== '') {
    // Parent node found
    return appendParentXPath(node.parentNode) + '/' + node.localName;
  } else {
    // Top node found
    return '/' + node.localName;
  }
}

module.exports.updateCsvMapArrayWithNewXPath = updateCsvMapArrayWithNewXPath;
module.exports.listFullXPathForEndNodes = listFullXPathForEndNodes;
