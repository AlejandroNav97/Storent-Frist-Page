
const SerialPort = require('serialport');
const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketIo.listen(server);

var temperature = "";
var humidity = "";
var persons = "";

io.on('connection', function (socket){

    console.log('a new socket connected');

});

app.get('/', (req, res, next) => {

    res.sendFile(__dirname + '/index.html');

});


const Readline = SerialPort.parsers.Readline;


const mySerial = new SerialPort('/dev/cu.usbmodem14201', {

    baudRate: 9600

});

const parser = mySerial.pipe(new Readline({delimiter: '\r\n'}));


mySerial.on('open', function(){

console.log('Opened Serial Port');

});

parser.on('data', function(data){

var info = data.split(":");
  
  temperature = info[0];
  humidity = info[1];
  persons = info[2];

    console.log(data.toString());
    io.emit('arduino:data', {
      value1: info[0],
      value2: info[1],
      value3: info[2],
    });

});

mySerial.on('err', function (err) {

    console.log(err.message);

});

server.listen(3000, () => {

console.log('server on port 3000');

});