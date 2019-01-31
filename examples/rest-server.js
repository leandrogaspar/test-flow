/* eslint-disable no-console */
const express = require('express');

const app = express();
const port = 3000;


app.get('/get', (req, res) => res.send('get ok'));
app.post('/post', (req, res) => res.send('post ok'));

app.listen(port, () => console.log(`Rest server listening on port ${port}!`));
