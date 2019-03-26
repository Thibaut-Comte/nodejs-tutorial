const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const originalMap = path.join('data', 'map.pdf');
const mapCopy = 'map-copy.pdf';

readFile(originalMap)
  .then((data) => {
    console.log(data);
    return writeFile(mapCopy, data);
  })
  .then(() => {
    console.log('fichier copié!');
  })
  .catch((err) => {
    console.log('une erreur est survenue: ', err);
  });
