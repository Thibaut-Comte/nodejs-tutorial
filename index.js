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
    const id = request.params.id;
    messageService.getMessage(id)
    .then(result => {
        if (!result) return response.sendStatus(404).end();
        response.send(result); 
    })
    .catch(error => {
        console.log('error: ', error);
        response.sendStatus(400).end(error);
    });
});

v1.post('/message', basicAuth, (request, response) => {
    const message = request.body;
    messageService.createMessage(message)
    .then((result) => {
        response.sendStatus(201);
    })
    .catch(error => {
        console.log('error: ', error);
        response.sendStatus(400).end(error);
    });
});

v1.put('/message/:id', basicAuth, (request, response) => {
    const id = request.params.id;
    const message = request.body;
    messageService.updateMessage(message, id)
    .then((result) => {
        if (result.matchedCount !== 1) return response.sendStatus(404);
        response.sendStatus(result.modifiedCount > 0 ? 200 : 304);
    })
    .catch(error => {
        console.log('error: ', error);
        response.sendStatus(400).end(error);
    });
});

v1.delete('/message/:id', basicAuth, (request, response) => {
    const id = request.params.id;
    messageService.deleteMessage(id)
    .then(() => {
        response.sendStatus(200);
    })
    .catch(error => {
        console.log('error: ', error);
        response.sendStatus(404).end(error);
    });
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
