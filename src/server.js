const express = require('express')
const app = express()
const io = require('socket.io-client')
const FFmpeg = require('./ffmpeg');
require('dotenv').config();

const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
app.listen(PORT, () => {
  console.log('listening on port: ' + PORT)
})

const socket = io(DOMAIN);

async function main() {
  socket.emit('create-producer', (port) => {
    new FFmpeg({
      kind: 'audio',
      port: port,
      filename: 'files/audio.mp3',
    });

    socket.emit('recive-producer-audio', { success: true })
  })
}

main()