const fs = require('fs');

function isMessageInvalid(message) {
    return !message.author || !message.quote;
}

module.exports = class MessageService {
    constructor() {
        fs.promises.readFile('./data/quotes.json')
        .then(quotes => {
            this.quotes = JSON.parse(quotes);
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