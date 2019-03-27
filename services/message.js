const fs = require('fs');

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
        if (!message.author || !message.quote) {
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
}
