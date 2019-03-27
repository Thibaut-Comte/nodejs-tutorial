const fs = require('fs');

module.exports = class MessageService {
    constructor() {
        fs.promises.readFile('./data/quotes.json')
        .then(quotes => {
            this.quotes = quotes;
        });
    }

    getMessages() {
        return this.quotes;
    }
}