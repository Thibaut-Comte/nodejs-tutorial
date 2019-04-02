const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message');
const messageService = new MessageService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    messageService.getMessages()
    .then(data => {
        response.send(data);
    });
});
v1.get('/message/:id', (request, response) => {
    const id = request.params.id;
    messageService.getMessage(id)
    .then(message => {
        message ? response.send(message) : response.sendStatus(404);
    });
});
v1.post('/message',  (request, response) => {
    const message = request.body;
    messageService.insertMessage(message)
    .then(result => {
        response.send(result);
    })
    .catch(error => {
        console.log('error occurs: ', error);
        response.sendStatus(400).end(error);
    });
});

v1.put('/message/:id',  (request, response) => {
    const id = request.params.id;
    const message = request.body;
    messageService.updateMessage(message, id)
    .then((res) => {
        response.sendStatus(res ? 200 : 404);
    })
    .catch(error => {
        console.log('error occurs: ', error);
        response.sendStatus(400).end(error);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
