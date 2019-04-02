const fs = require('fs');
const path = require('path');
const utils = require('util');

const originalMap = path.join('data', 'map.pdf');
const originalCSV = path.join('data', 'file.csv');

const mapcopy = 'map-copy.pdf';

const readFile = utils.promisify(fs.readFile);
const writeFile = utils.promisify(fs.writeFile);

// Fonction utilisant le stream cad petit à petit
function copy(original, copy, encoding) {
    const readStream = fs.createReadStream(original, encoding);
    const writeStream = fs.createWriteStream(copy);
    const fileStats = fs.statSync(original);
    readStream.pipe(writeStream);
    
    readStream.on('data', chunk => {
        console.log(`chunk lu : ${chunk.length} sur ${fileStats.size}`);
    });
    readStream.on('close', () => {
        console.log(`lecture de ${original} terminée`);
    });
    readStream.on('error', (err) => {
        console.log('error occurs during reading : ', err);
    });
}

copy(originalMap, 'map-copy.pdf');
copy(originalCSV, 'file-copy.csv');

// ReadFile en promesse
// readFile(originalMap)
//     .then(data => {
//         console.log(data);
//         return writeFile(mapcopy, data);
//     })
//     .then(result => {
//         console.log('fichier copié ! ', result);
//     })
//     .catch(err => {
//         console.log('error occurs ', err)
//     });