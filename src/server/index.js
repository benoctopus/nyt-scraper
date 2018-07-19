const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const socketIo = require('socket.io');
const connect = require('./controllers');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(morgan('combined'));
app.use(parser.urlencoded({ extended: true, }));
app.use(parser.json());
app.use(parser.text());
app.use('*', express.static('../../build'));

const io = socketIo.listen(app.listen(PORT));
connect(io);
