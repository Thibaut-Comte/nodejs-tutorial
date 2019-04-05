const { Client } = require('pg');

module.exports = class FileService {
    constructor() {
    }

    getConnectedClient() {
        const client = new Client();
        return client.connect()
        .then(() => client)
        .catch(err => {
            console.log('error occurs during PG connection ', err);
            throw err;
        })
    }

    saveFileInfos(fileInfos) {
        let client;
        return this.getConnectedClient()
        .then(connectedClient => {
            client = connectedClient;
            return client.query(
                `INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding) 
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    fileInfos.filename, 
                    fileInfos.mimetype, 
                    fileInfos.originalname, 
                    fileInfos.size, 
                    fileInfos.encoding
                ]
            )
            .then (() => {
                client.end();
            });
        });
    }
}