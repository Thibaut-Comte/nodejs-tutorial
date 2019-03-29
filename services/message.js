const { MongoClient, ObjectID } = require('mongodb');

function isMessageInvalid(message) {
    return !message.author || !message.quote;
}

const user = 'admin123';
const password = 'password2';

const dbName = 'heroku_xc906x0g';
const connectionUrl = `mongodb://${user}:${password}@ds127535.mlab.com:27535/${dbName}`;

function getDbClient() {
    return new MongoClient(connectionUrl, { useNewUrlParser: true }).connect();
}

module.exports = class MessageService {
    constructor() {
        getDbClient()
        .then(client => {
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
        return this.db.collection('messages').insertOne(message);
    }

    updateMessage(message, id) {
        if (isMessageInvalid(message)) {
            throw 'Message_parameter_exception';
        }
        return this.db.collection('messages').updateOne(
            { '_id': new ObjectID(id) },
            {
                $set: {
                    ...message
                }
            }
        );
    }

    deleteMessage(id) {
        return this.db.collection('messages').deleteOne({ '_id': new ObjectID(id) });
    }
}
