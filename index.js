'use strict';

const path = require('node:path');
const leadvm = require('leadvm');

const CTRL_C = 3;
const PATH = process.cwd();
const LOG_PATH = path.join(PATH, 'log');

const framework = { console };

const exit = message => {
  framework.console.info(message);
  process.exit(1);
};

const err = type => error => {
  const message = error?.stack ?? error?.message ?? 'exit';
  framework.console.error(`${type}: ${message}`);
  exit("Cant't start App");
};

const setup = async () => {
  framework.console.info('Starting');
  return 1;
};

const stop = async () => {
  exit('Application stopped');
};

process.on('unhandledRejection', err('UNHANDLED REJECTION'));
process.on('uncaughtException', err('UNCAUGHT EXCEPTION'));
process.on('warning', err('WARNING'));
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdin.on('data', data => data[0] === CTRL_C && stop());
}

module.exports = setup().catch(err('INIT'));
