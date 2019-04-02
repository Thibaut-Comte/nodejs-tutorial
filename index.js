const express = require('express');
const app = express();
const v1 = express.Router();
const util = require('util');
const fs = require('fs');
const bodyParser = require('body-parser');
const MessageService = require('./message');

const message = new MessageService();

const readFile = util.promisify(fs.readFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    response.send(message.getMessages());
});

v1.get('/message/:id', (request, response) => {
    const id = request.params.id;
    response.send(message.getMessage(id));
});

v1.post('/message', (request, response) => {
    response.send(message.createMessage(request.body));
});

v1.put('/message/:id', (request, response) => {
    const id = request.params.id;
    const newMsg = {
        ...request.body,
        id: id
    }
    response.send(message.updateMessage(newMsg));
});

v1.delete('/message/:id', (request, response) => {
    const id = request.params.id;
    response.send(message.deleteMessage(id));
});

app.listen(3000, () => {
    console.log('Server listening on port 3000 !')
});