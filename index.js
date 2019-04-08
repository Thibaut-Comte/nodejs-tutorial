const app = require('./main');

app.listen(process.env.APP_PORT, () => {
  console.log('Server listening on port:', process.env.APP_PORT);
});
