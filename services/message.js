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
}
