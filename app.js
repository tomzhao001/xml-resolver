const xmlResolver = require('./xmlresolver/xmlResolver');
const config = require('./xmlresolver/config');
const async = require('async');

let xmlExecFuncList = [];

config.getConfigJsonObj().then((configObj) => {
  let xmlPath = configObj.xmlInputPath;
  let csvPath = configObj.csvOutputPath;
  let vendorNameList = configObj

  /**
   * Push async functions into a FunctionList, 
   * and use async.series to pop out and execute them.
   */
  xmlPathList.forEach((xmlPath) => {
    xmlExecFuncList.push(async () => {
      console.log('Start resolving the xml: ' + xmlPath + ', Vendor Name: ' + vendorName);
      await xmlResolver.resolveXml(xmlPath, csvPath, vendorName);
      return xmlPath;
    });
  });

  async.series(xmlExecFuncList, (err, results) => {
    if (!err) {
      console.log('Finish processing with results: ' + results);
    }
  })

}).catch((exception) => {
  console.error(`Error on reading the config file, please check the details below.`);
  throw exception;
});





