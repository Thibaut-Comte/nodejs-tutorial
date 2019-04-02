const fs = require('fs');
const path = require('path');
const utils = require('util');

const originalMap = path.join('data', 'map.pdf');
const mapcopy = 'map-copy.pdf';

const readFile = utils.promisify(fs.readFile);
const writeFile = utils.promisify(fs.writeFile);

readFile(originalMap)
    .then(data => {
        console.log(data);
        return writeFile(mapcopy, data);
    })
    .then(result => {
        console.log('fichier copié ! ', result);
    })
    .catch(err => {
        console.log('error occurs ', err)
    });

// fs.readFile(originalMap, (err, data) => {
//     if (err) {
//         console.log('error occurs ', err);
//         throw err;
//     }
//     console.log(data);
//     fs.writeFile(mapcopy, data, (err) => {
//         if (err) {
//             console.log('error occurs ', err);
//             throw err;
//         } else {
//             console.log('fichier copié');
//         }
        
//     })
// });