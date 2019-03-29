const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

function isMessageInvalid(message) {
    return !message.author || !message.quote;
}

module.exports = class MessageService {
    constructor() {

        const user = encodeURIComponent('heroku_xc906x0g');
        const password = encodeURIComponent("=B'rLG'YTps3li=a:jjn");

        this.connectionUrl = `mongodb://${user}:${password}@ds127535.mlab.com:27535/${user}`;
        this.dbName = 'heroku_xc906x0g';
    
        fs.promises.readFile('./data/quotes.json')
        .then(quotes => {
            this.quotes = JSON.parse(quotes);
        });

        const client = new MongoClient(this.connectionUrl);
        client.connect((err) => {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
            
            console.log('Connected successfully to server');
            const db = client.db(this.dbName);
            client.close();
        });
    }

    getMessages() {
        return this.quotes;
    }

    getMessage(id) {
        return this.quotes.find(quote => quote.id === id);
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
