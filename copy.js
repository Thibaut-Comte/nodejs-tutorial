const fs = require('fs');
const path = require('path');

const originalMap = path.join('data', 'map.pdf');
const mapCopy = 'map-copy.pdf';

fs.readFile(originalMap, (err, data) => {
  if (err) throw err;
  console.log(data);
  fs.writeFile(mapCopy, data, (err) => {
    if (err) throw err;
    console.log('fichier copié!');
  });
});
