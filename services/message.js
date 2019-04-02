const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = class MessageService {
  constructor() {
    readFile(__dirname + '/../data/quotes.json', {encoding: 'utf8'})
    .then(data => {
      this.quotes = JSON.parse(data);
    });
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