const express = require('express');
var bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const v1 = express.Router();

const upload = multer({ dest: 'data/upload/' })

const MessageService = require('./services/message');
const messageService = new MessageService();

const { basicAuth } = require('./middleware/basic-auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    messageService.getMessages()
        .then(results => {
            response.send(results); 
        })
        .catch(error => {
            console.log('error: ', error);
            response.sendStatus(400).end(error);
        });
});

v1.get('/message/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    response.send(
        messageService.getMessage(id)
    );
});

v1.post('/message', basicAuth, (request, response) => {
    const message = request.body;
    try {
        response.send(messageService.createMessage(message));
    } catch (error) {
        response.sendStatus(400).end(error);
    }
});

v1.put('/message/:id', basicAuth, (request, response) => {
    const id = parseInt(request.params.id, 10);
    const message = {
        ...request.body,
        id
    };
    try {
        messageService.updateMessage(message);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(400).end(error);
    }
});

v1.delete('/message/:id', basicAuth, (request, response) => {
    const id = parseInt(request.params.id, 10);
    try {
        messageService.deleteMessage(id);
        response.sendStatus(200);
    } catch (error) {
        response.sendStatus(404).end(error);
    }
});

v1.post('/file', upload.single('file'), (request, response) => {
    console.log(request.file);
    response.sendStatus(200);
});

v1.get('/file', (request, response) => {
    response.download(__dirname + '/data/quotes.json');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
