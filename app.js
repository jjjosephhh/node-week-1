const express = require('express');
const goodsRouter = require('./routes/goods');

const connect = require('./schemas');
connect();

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', [goodsRouter]);

app.listen(port, () => {
  console.log(port, 'Server is open with port!');
});