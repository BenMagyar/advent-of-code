import path from 'path';
import fs from 'fs-extra';
import { answer } from '../utils';

async function readModules() {
  return (await fs.readFile(path.resolve(__dirname, './input.txt')))
    .toString()
    .split('\n')
    .map(line => parseFloat(line))
    .filter(line => !isNaN(line));
}

function requiredFuel(weight: number) {
  return Math.max(0, Math.floor(weight / 3) - 2);
}

function recursiveRequiredFuel(weight: number, existing: number = 0): number {
  const fuel = requiredFuel(weight);
  if (fuel > 0) {
    return recursiveRequiredFuel(fuel, existing + fuel);
  }
  return existing + fuel;
}

answer(1, async function() {
  const modules = await readModules();
  return modules.map(requiredFuel).reduce((a, b) => a + b);
});

answer(2, async function() {
  const modules = await readModules();
  return modules
    .map(module => recursiveRequiredFuel(module))
    .reduce((a, b) => a + b);
});
