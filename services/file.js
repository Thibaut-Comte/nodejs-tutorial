const { Client } = require('pg')
module.exports = class FileService {
  constructor() {
    // const client = new Client();
    // client.connect()
    // .then(() => {
    //   console.log('connection PG ok');
    // })
    // .catch(err => {
    //   console.log('error occurs during PG Connection ', err)
    // });
  }

  getConnectedClient() {
    const client = new Client();
    return client.connect()
    .then(() => client)
    .catch(err => {
      console.log('error occurs during PG Connection ', err);
      throw err;
    });
  }

  saveFileInfos(fileInfo) {
    let client;
    return this.getConnectedClient()
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
      client.end();
    });
  }
}
