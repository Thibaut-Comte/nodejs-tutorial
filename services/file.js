const { Pool } = require('pg');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

module.exports = class FileService {
  constructor() {
    this.pool = new Pool();
  }

  openTransaction() {
    let client;
    return this.pool.connect()
    .then(connectedClient => {
      client = connectedClient;
      return client.query('BEGIN');
    })
    .then(() => client);
  }

  validateTransaction(client) {
    return client.query('COMMIT')
    .then(() => {
      client.release();
    });
  }

  abortTransaction(client) {
    return client.query('ROLLBACK')
    .then(() => {
      client.release();
    });
  }

  saveFileInfos(fileInfo) {
    let client;
    return this.openTransaction()
    .then(connectedClient => {
      client = connectedClient;
      return client.query(
        `INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          fileInfo.filename,
          fileInfo.mimetype,
          fileInfo.originalname,
          fileInfo.size,
          fileInfo.encoding
        ]
      );      
    })
    .then(() => {
      return this.validateTransaction(client);
    })
    .catch(err => {
      console.log('error occurs: ', err);
      return this.abortTransaction(client)
      .then(() => {
        return unlink('data/upload/' + fileInfo.filename);
      })
      .then(() => Promise.reject(err));
    });
  }

  getFileInfos() {
    let client;
    return this.pool.connect()
    .then(connectedClient => {
      client = connectedClient;
      return client.query(
        'SELECT id, "file-name", "mime-type", "original-name", size, encoding FROM filestore;'
      );      
    })
    .then((result) => {
      client.release();
      return result.rows;
    });
  }

  getFile(id) {
    let client;
    return this.pool.connect()
    .then(connectedClient => {
      client = connectedClient;
      return client.query(
        'SELECT "file-name", "mime-type", "original-name", size, encoding FROM filestore WHERE id=$1',
        [id]
      );
    })
    .then(result => {
      client.release();
      if (result.rows.length === 0) return Promise.reject('no result');
      const fileInfo = result.rows[0];
      const fileReadStream = fs.createReadStream(
        __dirname + '/../data/upload/' + fileInfo['file-name']
      );
      return { fileReadStream, fileInfo };
    });
  }

}
