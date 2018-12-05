const xmlResolver = require('./xmlresolver/xmlResolver');
const config = require('./xmlresolver/config');

config.getConfigJsonObj().then((configObj) => {
  xmlResolver.resolveXmlsFromConfig(configObj);
}).catch((exception) => {
  console.error(`Error on reading the config file, please check the details below.`);
  throw exception;
});
