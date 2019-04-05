const { Pool } = require('pg');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

module.exports = class FileService {
  constructor() {
    this.pool = new Pool();
  }

  saveFileInfos(fileInfo) {
    let client;
    return this.pool.connect()
    .then(connectedClient => {
      client = connectedClient;
      return client.query('BEGIN');
    })
    .then(() => {
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
      return client.query('COMMIT');
    })
    .then(() => {
      client.release();
    })
    .catch(err => {
      console.log('error occurs: ', err);
      return client.query('ROLLBACK')
      .then(() => {
        client.release();
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
        'SELECT id, "file-name", "mime-type", "original-name", size, encoding from filestore;'
      );      
    })
    .then((result) => result.rows);
  }
}
