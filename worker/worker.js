
import worker_threads from 'worker_threads';

const {data, regExp} =  worker_threads.workerData;

const matches = (data.match(regExp) || []) // если нет совпадений (null) тогда пустой массив

worker_threads.parentPort.postMessage(matches);
