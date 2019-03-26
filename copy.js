const fs = require('fs').promises;
const path = require('path');

const originalMap = path.join('data', 'map.pdf');
const originalCsv = path.join('data', '100_lines.csv');

function copy(original, copy, encoding) {
  fs.unlink(copy)
  .catch(() => Promise.resolve())
  .then(() => fs.readFile(original, encoding))
  .then((data) => {
    console.log(data);
    return fs.writeFile(copy, data);
  })
  .then(() => {
    console.log('fichier copié!');
  })
  .catch((err) => {
    console.log('une erreur est survenue: ', err);
  });
}

copy(originalMap, 'map-copy.pdf');
copy(originalCsv, '100_lines-copy.csv', 'utf8');
