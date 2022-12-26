'use strict';


import { lstatSync, readdirSync, readFileSync } from "fs";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import colors from "colors/safe.js";
import { join } from "path";
import worker_threads from "worker_threads";


const log = console.log;
const options = yargs(hideBin(process.argv))//для работы import
  .usage('Usage: -p path to the dir -s search pattern')
  .options({
    'path': {
      type: 'string',
      alias: 'p',
      describe: 'Path to dir',
      default: process.cwd()
    },
    'search': {
      type: 'string',
      alias: 's',
      describe: 'Search pattern',
      default: ''
    }
  }).argv;

const getFileData = async (path) => {
  const data = readFileSync(path, 'utf-8');

  if (options.search) {
    const regExp = new RegExp(`${options.search}`, 'gim');

    // const matches = (data.match(regExp) || []) // если нет совпадений (null) тогда пустой массив
    const matches = await searchWorker(data, regExp);

    if (matches.length) {
      log(colors.green(`${matches.length} matches in the following lines`));
      const lines = data.split("\n");
      lines.forEach(line => {
        regExp.lastIndex = 0 // без этого бывают не верные проверки
        if (regExp.test(line)) log(line);
      });
    } else log(colors.red('No matches'));

  } else log(data);
};



const searchWorker = (data, regExp) => {
  return new Promise((resolve, reject) => {
    const worker = new worker_threads.Worker('./worker/worker.js', {
      workerData: {
        data,
        regExp
      },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
  });
};

const getPathway = (path, filename) => {
  return {
    path: join(path, filename),
    filename: filename
  }
};

const reader = (path) => {

  if (lstatSync(path).isFile()) return getFileData(path);

  const listFiles = readdirSync(path);
  const listFilesWithPath = listFiles.map((filename) => getPathway(path, filename));

  inquirer.prompt([{
    name: 'filename',
    type: 'list',
    message: `Current directory: ${path}`,
    loop: false,
    choices: listFilesWithPath.map((element) => ({
      name: element.filename,
      value: element.path,
    })),
  },
  ]).then(({ filename }) => reader(filename));
};

reader(options.path);
