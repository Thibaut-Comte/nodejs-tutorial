const { Pool, Client } = require('pg');
const fs = require('fs');

module.exports = class FileService {
  constructor() {
    this.pool = new Pool({
      user: 'lzfvglnz',
      host: 'manny.db.elephantsql.com',
      database: 'lzfvglnz',
      password: '2fD287ucKBb22L0yxurwfC3Xe7B5Ws5W',
      port: 5432,
    });
  }

  getClient() {
    return new Client({
      user: 'lzfvglnz',
      host: 'manny.db.elephantsql.com',
      database: 'lzfvglnz',
      password: '2fD287ucKBb22L0yxurwfC3Xe7B5Ws5W',
      port: 5432,
    });
  }

  openTransaction(client) {
    return client.query('BEGIN');
  }

  validateTransaction(client) {
    client.query('COMMIT');
    return client.end();
  }

  abortTransaction(client) {
    client.query('ROLLBACK');
    return client.end();
  }

  addFileInfo(fileInfo) {
    const client = this.getClient();
    return client.connect()
    .then(() =>
      client.query(
        'INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding) VALUES($1, $2, $3, $4, $5);',
        [fileInfo.filename, fileInfo.mimetype, fileInfo.originalname, fileInfo.size, fileInfo.encoding]
      )
    ).then(res => client.end());
  }

  getFileInfos() {
    const client = this.getClient();
    let result;
    return client.connect()
    .then(() =>
      client.query(
        'SELECT id, "file-name", "mime-type", "original-name", size, encoding FROM filestore;'
      )
    ).then(({ rows }) => {
      result = rows;
      return client.end();
    }).then(() => result);
  }

  getFileInfo(id) {
    const client = this.getClient();
    let result;
    return client.connect()
    .then(() =>
      client.query(
        'SELECT id, "file-name", "mime-type", "original-name", size, encoding FROM filestore WHERE id = $1;',
        [id]
      )
    ).then(({ rows }) => {
      result = rows.length >0 ? rows[0] : null ;
      return client.end();
    }).then(() => result);
  }

  deleteFile(id) {
    let client;
    let fileName;

    return this.pool.connect()
      .then(poolClient => {
        client = poolClient
        return this.openTransaction(client)
      })
      .then(() => {
        return client.query(
          'SELECT "file-name" FROM filestore WHERE id = $1;',
          [id]
        );
      })
      .then(({ rows }) => {
        if (!rows || !rows.length) return Promise.reject(`file not found with id ${id}`);
        fileName = rows[0]['file-name'];
        return client.query(
          'DELETE FROM filestore WHERE id = $1;',
          [id]
        );
      })
      .then(result => {
        console.log('delete result : ', result);
        if(result.rowCount === 1)
          return fs.promises.unlink(__dirname+ '/../data/upload/' + fileName);
      })
      .then(()=> this.validateTransaction(client))
      .catch(error => {
        console.log('error occurs: ', error);
        this.abortTransaction(client);
        return Promise.reject(err);
      });
  }
}
