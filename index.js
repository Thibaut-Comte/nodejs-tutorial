// websocket
require('./web/websocket');
const express = require('express');

const app = require('./main');

app.use(express.static('public'));
app.listen(process.env.APP_PORT, () => {
  console.log('Server listening on port:', process.env.APP_PORT);
});
