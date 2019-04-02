const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

module.exports = class MessageService {
    constructor() {
        readFile(__dirname + '/../quotes.json', {encoding: 'utf8'})
        .then(data => {
            this.quotes = JSON.parse(data);
        });
    }

    isMessageInvalid(message) {
        return !message.author || !message.quote;
    }    

    getMessages() {
        return Promise.resolve(this.quotes);
    }

    getMessage(id) {
        return Promise.resolve(
            this.quotes.find(quote => {
                return quote.id == id;
            })
        );
    }
}


