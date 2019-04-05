const { Pool } = require('pg');
const fs = require('fs');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
    }

    saveFileInfos(fileInfos) {
        let client;
        return this.pool.connect()
        .then(connectedClient => {
            client = connectedClient;
            return client.query('BEGIN')
            .then(() => {
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
            })            
            .then (() => {
                return client.query('COMMIT');
            })
            .then(() => {
                client.release();
            })
            .catch(err => {
                error = err;
                console.log('error occurs : ', err)
                return client.query('ROLLBACK')
                .then(() => {
                    return fs.unlink(__dirname + '../' + process.env.UPLOAD_DIR + fileInfos.filename);
                    client.release();            
                })
                .then(() => Promise.reject(error));
            });
        });
    }

    getFileInfos() {
        let client;
        return this.pool.connect()
        .then(connectedClient => {
            client = connectedClient;
            return client.query(
                `SELECT id, "file-name", "mime-type", "original-name", size, encoding 
                from filestore`
            );
        })
        .then(result => {
            return result.rows;
        });
    }
}