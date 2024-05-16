const childProcess = require('child_process');
const Streamer = require('./streamer');
const path = require("path")
var kill = require('tree-kill');
module.exports = class FFmpeg extends Streamer {
    constructor(options) {
        super(options);

        this.time = options.time || '00:00:00.0'; 
        this.createProcess();
        this.initListeners();
    }

    createProcess() {
        this.process = childProcess.spawn('ffmpeg', this.getArgs(this.kind, this.port, this.filename, this.time));
    }
    killProcess() {
        console.log("kill")
        kill(this.process.pid)
    }
    getArgs(kind, port, filename, time, hostip) {
        return [
            '-loglevel', 'debug',
	        '-re',
	        '-ss', '00:00:00.0',
	        '-f', 'alsa',
	        '-i', 'plughw:4,0',
	        '-acodec', 'libopus',
	        '-ab', '192k',
	        '-ac', '2',
	        '-ar', '48000',
	        '-c:a', 'libopus',
	        '-f', 'rtp',
          '-payload_type', '101',
          '-ssrc', '11111111',
          `rtp://${hostip}:${port}`,
        ];
    }
  
    // getArgs(kind, port, filename, time) {
    //     const map = (kind === 'video') ? '0:v:0' : '0:a:0';
    //     return [
    //     '-loglevel',
    //     'debug',
    //     '-re',
    //     '-v',
    //     'info',
    //     '-ss',
    //     time,
    //     '-i',
    //     filename,
    //     '-map',
    //     map,
    //     '-f',
    //     'tee',
    //     '-acodec',
    //     'libopus',
    //     '-ab',
    //     '128k',
    //     '-ac',
    //     '2',
    //     '-ar',
    //     '48000',
    //     '-pix_fmt',
    //     'yuv420p',
    //     '-c:v',
    //     'libvpx',
    //     '-b:v',
    //     '1000k',
    //     '-deadline',
    //     'realtime',
    //     '-cpu-used', // https://www.webmproject.org/docs/encoder-parameters/
    //     '2',
    //     // `[select=v:f=rtp:ssrc=22222222:payload_type=102]rtp://127.0.0.1:${port}`,
    //     `[select=a:f=rtp:ssrc=11111111:payload_type=101]rtp://54.179.9.199:${port}`,
    //     ];
    // }
};
