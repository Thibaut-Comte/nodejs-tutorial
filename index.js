const express = require('express');
const app = express();
const v1 = express.Router();

const MessageService = require('./services/message');
const messageService = new MessageService();

app.use('/api/v1', v1);

v1.get('/message', (request, response) => {
    response.send(
        messageService.getMessages()
    );
});

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
