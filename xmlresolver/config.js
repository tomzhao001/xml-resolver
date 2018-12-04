const fs = require('fs');

const CONFIG_PATH = '../config.json';

async function getConfigJsonObj () {
  return new Promise((resolve, reject) => {
    fs.readFile(CONFIG_PATH, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data.toString()));
    });
  });
}

module.exports.getConfigJsonObj = getConfigJsonObj;
