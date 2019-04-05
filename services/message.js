const {MongoClient, ObjectID} = require('mongodb');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);


module.exports = class MessageService {
  constructor() {
    readFile(__dirname + '/../data/quotes.json', {encoding: 'utf8'})
    .then(data => {
      this.quotes = JSON.parse(data);
    })
  }

  getConnectedClient() {
    const client = new MongoClient(
      process.env.MONGO_CONNEXION_URL,
      {useNewUrlParser: true}
    );
    return client.connect();
  }

  getMessages() {
    let client;
    return this.getConnectedClient()
      .then((connectedClient) => {
        client = connectedClient;
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        return collection.find({}).toArray();
      })
      .then(result => {
        client.close();
        return result;
      })
  }

  getMessage(id) {
    let client;
    return this.getConnectedClient()
      .then((connectedClient) => {
        client = connectedClient;
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        return collection.findOne({ 
          _id: new ObjectID(id)
        });
      })
      .then(result => {
        client.close();
        return result;
      })
  }

  isValid(message) {
    return message.author && message.quote;
  }

  insertMessage(message) {
    if (!this.isValid(message)) return Promise.reject('invalid message');    
    let client;
    return this.getConnectedClient()
      .then((connectedClient) => {
        client = connectedClient;
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        return collection.insertOne({ 
          ...message
        });
      })
      .then(result => {
        client.close();
        return {
          ...message,
          _id: result.insertedId
        };
      })
  }

  updateMessage(message, id) {
    if (!this.isValid(message)) return Promise.reject('invalid message');
    let client;
    return this.getConnectedClient()
      .then((connectedClient) => {
        client = connectedClient;
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        return collection.updateOne(
          { _id : new ObjectID(id)},
          { $set: message }
        );
      })
      .then(result => {
        client.close();
        return {
          isFind: result.matchedCount === 1,
          isModified: result.modifiedCount === 1
        };
      })
  }

  deleteMessage(id) {
    let client;
    return this.getConnectedClient()
      .then((connectedClient) => {
        client = connectedClient;
        const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
        return collection.deleteOne(
          { _id : new ObjectID(id)}
        );
      })
      .then(result => {
        client.close();
        return result.deletedCount === 1;
      })
  }
}