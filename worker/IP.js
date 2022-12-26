'use strict';

import fs from "fs";
import readline from "readline";
import { stdout } from "process";
import worker_threads from "worker_threads";


const log = console.log;
const dataFile = './access.log';
const logFileName = '_requests.log';
const IP = {
  1: '89.123.1.41',
  2: '34.48.240.111'
};
const IP1Log = fs.createWriteStream(IP[1] + logFileName);
const IP2Log = fs.createWriteStream(IP[2] + logFileName);
const stream = fs.createReadStream(dataFile, 'utf-8');
const rl = readline.createInterface({ input: stream });


const searchWorker = (line, IP) => {

  return new Promise((resolve, reject) => {
    const worker = new worker_threads.Worker('./worker/workerIP.js', {
      workerData: {
        line,
        IP
      },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
  });
};


rl.on("line", (line) => {

  (async () => {
    if (await searchWorker(line, IP[1])) IP1Log.write(line + "\n");
    if (await searchWorker(line, IP[2])) IP2Log.write(line + "\n");
  })();

});


rl.on('close', () => {
  stdout.cursorTo(0);
  log('Processing done');
});
