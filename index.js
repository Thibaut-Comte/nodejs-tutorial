const express = require('express');
const app = express();
const v1 = express.Router();
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);


app.use(express.json());
app.use(express.urlencoded());
app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    readFile('./data/quotes.json')
        .then(data => {
            response.send(data);
        });
});

v1.get('/message/:id', (request, response) => {
    const id = request.params.id;
    console.log(id);
    readFile('./data/quotes.json')
        .then(data => {
            const datas = JSON.parse(data);
            const msg = datas.find(element => {
                if (element.id === parseInt(id)) {
                    return element;
                }
            });
            msg ? response.send(msg) : response.send(response.sendStatus(404).end());
        });
});

v1.post('/message', (request, response) => {

    readFile('./data/quotes.json')
    .then(data => {
        const datas = JSON.parse(data);

        const id = datas.length+1;
        const quote = request.body.quote;
        const author = request.body.author;        
        
        const newConst = {
            "quote" : quote,
            "author": author,
            "id": id
        };

        datas.push(newConst);
        response.sendStatus(201).end();
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000 !')
});