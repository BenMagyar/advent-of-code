import path from 'path';
import fs from 'fs-extra';
import { answer } from '../utils';

const ADD = 1;
const MULTIPLY = 2;
const END = 99;

const FIND_VALUE = 19690720;

async function readValues() {
  const file = await fs.readFile(path.resolve(__dirname, './input.txt'));
  return file
    .toString()
    .split('\n')[0]
    .split(',')
    .map(parseFloat);
}

function run(input: Array<number>, position = 0): Array<number> {
  const ii = (p: number) => input[input[p]];
  const code = input[position];
  switch (code) {
    case ADD:
      input[input[position + 3]] = ii(position + 1) + ii(position + 2);
      break;
    case MULTIPLY:
      input[input[position + 3]] = ii(position + 1) * ii(position + 2);
      break;
    case END:
      return input;
  }
  return run(input, position + 4);
}

answer(1, async function() {
  const values = await readValues();
  return run(values)[0];
});

answer(2, async function() {
  const input = await readValues();
  for (let i = 0; i < 100; i++) {
    input[1] = i;
    for (let j = 0; j < 100; j++) {
      input[2] = j;
      if (run(input.slice(0))[0] === FIND_VALUE) {
        return 100 * i + j;
      }
    }
  }
});
