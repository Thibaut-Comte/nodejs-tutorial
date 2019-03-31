const express = require('express');
var bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');

const app = express();
const v1 = express.Router();

const upload = multer({ dest: 'data/upload/' })

const MessageService = require('./services/message');
const messageService = new MessageService();

const FileService = require('./services/file');
const fileService = new FileService();

const { basicAuth } = require('./middleware/basic-auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    response.send(
        messageService.getMessages()
    );
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
    fileService.addFileInfo(request.file)
        .then(res => {
            response.sendStatus(200);
        })
        .catch(error => {
            console.log('error: ', error);
            response.sendStatus(400).end(error);
        });
});

v1.get('/file', (request, response) => {
    fileService.getFileInfos()
        .then(res => {
            response.send(res);
        })
        .catch(error => {
            console.log('error: ', error);
            response.sendStatus(400).end(error);
        });
});

v1.get('/file/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    fileService.getFileInfo(id)
        .then(fileInfo => {
            if (!fileInfo) return response.sendStatus(404);
            const file = __dirname + '/data/upload/' + fileInfo['file-name'];
            response.setHeader('Content-disposition', 'attachment; filename=' + fileInfo['original-name']);
            response.setHeader('Content-type', fileInfo['mime-type']);
            response.setHeader('Content-Length', fileInfo.size);
            
            fs.createReadStream(file).pipe(response);
        })
        .catch(error => {
            console.log('error: ', error);
            response.sendStatus(400).end(error);
        });
});

v1.delete('/file/:id', (request, response) => {
    const id = parseInt(request.params.id, 10);
    fileService.deleteFile(id)
    .then(() => {
        response.sendStatus(200);
    })
    .catch(error => {
        console.log('error: ', error);
        response.sendStatus(500).end(error);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
