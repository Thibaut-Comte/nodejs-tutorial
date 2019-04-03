require('dotenv').config();
const db = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message');
const messageService = new MessageService();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', v1);


const basicAuth = (request, response, next) => {
    const authorization = request.headers.authorization;
    //On récupère la partie 1 donc la 2nde ici le mdp en base64
    const decoded = Buffer.from(authorization.split(" ")[1], 'base64').toString('utf8');

    const login = decoded.split(":")[0];
    const pwd = decoded.split(":")[1];

    if (login == "test" && pwd == "password") {
        return next();
    } else {
        response.sendStatus(401).end();

    }
};

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
v1.post('/message', basicAuth,  (request, response) => {
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

v1.put('/message/:id', basicAuth,  (request, response) => {
    const id = request.params.id;
    const message = {...request.body};
    messageService.updateMessage(message, id)
    .then((res) => {
        if (!res.isFind) return response.sendStatus(404);
        if (!res.isModified) return response.sendStatus(304);
        response.sendStatus(200);
    })
    .catch(error => {
        console.log('error occurs: ', error);
        response.sendStatus(400).end(error);
    });
});

v1.delete('/message/:id', basicAuth,  (request, response) => {
    const id = request.params.id;
    messageService.deleteMessage(id)
    .then(() => {
        response.sendStatus(200);
    })
    .catch(error => {
        response.sendStatus(404).end(error);
    });
})

app.listen(process.env.APP_PORT, () => {
    console.log('Server listening on port :',process.env.APP_PORT);
});