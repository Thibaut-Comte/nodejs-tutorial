const { Client } = require('pg');

module.exports = class FileService {

  getClient() {
    return new Client({
      user: 'lzfvglnz',
      host: 'manny.db.elephantsql.com',
      database: 'lzfvglnz',
      password: '2fD287ucKBb22L0yxurwfC3Xe7B5Ws5W',
      port: 5432,
    });
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
}
