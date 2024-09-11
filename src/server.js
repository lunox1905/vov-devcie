const express = require('express')
const app = express()
const io = require('socket.io-client')
const FFmpeg = require('./ffmpeg');
require('dotenv').config('../env');

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
const HOST_IP = process.env.HOST_IP;

app.listen(PORT, () => {
  console.log('listening on port: ' + PORT)
})
const socket = io(DOMAIN);
let FFmpegInstance = null;
async function main() {
    socket.emit('create-producer', {channelId: "667e7da6e30d33f0e4df8eec", uid: '1', port: 20108}, (port) => {
      console.log(port)
      FFmpegInstance = new FFmpeg({
          kind: 'audio',
          port: port,
          hostip: HOST_IP,
          ssrc: 11111111,
          // filename: 'files/audio.mp3',
          filename: 'http://media.kythuatvov.vn:8005'
        });
      })
  }

  socket.on('connect', () => {
    console.log('Connected to server');
    setTimeout(() => {
      main()
    }, 2000);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
    if (FFmpegInstance) {
    FFmpegInstance.killProcess()
  }
});