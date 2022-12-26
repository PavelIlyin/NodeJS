import worker_threads from 'worker_threads';

const {line, IP} =  worker_threads.workerData;

const matches = line.includes(IP);

worker_threads.parentPort.postMessage(matches);
