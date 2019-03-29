const fs = require('fs');
const { MongoClient, ObjectID } = require('mongodb');

function isMessageInvalid(message) {
    return !message.author || !message.quote;
}

const user = 'admin123'; //encodeURIComponent('heroku_xc906x0g');
const password = 'password2'; //encodeURIComponent("=B'rLG'YTps3li=a:jjn");

const dbName = 'heroku_xc906x0g';
const connectionUrl = `mongodb://${user}:${password}@ds127535.mlab.com:27535/${dbName}`;

function getDbClient() {
    return new MongoClient(connectionUrl, { useNewUrlParser: true }).connect();
}

module.exports = class MessageService {
    constructor() {
        fs.promises.readFile('./data/quotes.json')
        .then(quotes => {
            this.quotes = JSON.parse(quotes);
            return getDbClient();
        }).then(client => {
            this.client = client;
            this.db = client.db(dbName);
        });
    }

    getMessages() {
        return this.db.collection('messages').find({}).toArray();
    }

    getMessage(id) {
        return this.db.collection('messages').findOne({ '_id': new ObjectID(id) });
    }

    createMessage(message) {
        if (isMessageInvalid(message)) {
            throw 'Message_parameter_exception';
        }
        const ids = this.quotes.map(quote => parseInt(quote.id, 10));
        const nextId = Math.max(...ids) + 1;
        const newMessage = {
            ...message,
            id: nextId
        };
        this.quotes.push(newMessage);
        return newMessage;
    }

    updateMessage(message) {
        if (isMessageInvalid(message)) {
            throw 'Message_parameter_exception';
        }
        const indexToChange = this.quotes.findIndex(quote => quote.id === message.id);
        this.quotes[indexToChange] = message;
    }

    deleteMessage(id) {
        const indexToChange = this.quotes.findIndex(quote => quote.id === id);
        if (indexToChange < 0) {
            throw 'Message_not_found_exception';
        }
        this.quotes.splice(indexToChange, 1);
    }
}
