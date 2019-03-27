const express = require('express');
const app = express();
const v1 = express.Router();
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    readFile('./data/quotes.json')
    .then(data => {
        response.send(data);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
