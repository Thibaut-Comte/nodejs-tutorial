const fs = require('fs').promises;
const path = require('path');

const originalMap = path.join('data', 'map.pdf');
const mapCopy = 'map-copy.pdf';

fs.unlink(mapCopy)
  .catch(() => Promise.resolve())
  .then(() => fs.readFile(originalMap))
  .then((data) => {
    console.log(data);
    return fs.writeFile(mapCopy, data);
  })
  .then(() => {
    console.log('fichier copié!');
  })
  .catch((err) => {
    console.log('une erreur est survenue: ', err);
  });
