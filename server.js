const express = require('express');
const helmet = require("helmet");
const app = express()
const port = process.env.PORT || 3000;
const ip = process.env.IP || '0.0.0.0';

const data = require('./functions/data.js');

// app.disable('x-powered-by');
app.use(helmet());

app.use(express.static('./dist', {
  extensions: ['html']
}));

app.use('/data', data.handler);

app.listen(port, ip, () => {
  console.log(`App listening at http://${ip}:${port}`)
});
