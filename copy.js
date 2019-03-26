const fs = require('fs');
const path = require('path');

const originalMap = path.join('data', 'map.pdf');
const originalCsv = path.join('data', '100_lines.csv');

function copy(original, copy, encoding) {
  const readStream = fs.createReadStream(original, encoding);
  const writeStream = fs.createWriteStream(copy);

  try {
    fs.unlinkSync(copy);
  } catch (unlinkError) {
    console.log(`pas de fichier ${copy} à supprimer.`, unlinkError);
  }

  readStream.on('data', chunk => {
    console.log('chunk lu : ', chunk);
    let isWriteOK = writeStream.write(chunk, encoding);
    console.log('isWriteOK? ', isWriteOK);
  });
  readStream.on('close', () => {
    console.log(`lecture de ${original} terminée`);
  });
}

copy(originalMap, 'map-copy.pdf');
copy(originalCsv, '100_lines-copy.csv', 'utf8');
