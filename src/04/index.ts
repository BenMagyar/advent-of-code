import path from 'path';
import fs from 'fs-extra';
import { answer } from '../utils';

type Range = { start: number; end: number };

async function getInput(): Promise<Range> {
  const file = await fs.readFile(path.resolve(__dirname, './input.txt'));
  const parts = file
    .toString()
    .split('\n')[0]
    .split('-');
  return { start: parseInt(parts[0], 10), end: parseInt(parts[1], 10) };
}

function hasDecreasingDigits(guess: number) {
  const digits = guess
    .toString()
    .split('')
    .map(d => parseInt(d, 10));
  for (let i = 1; i < digits.length; i++) {
    if (digits[i - 1] > digits[i]) {
      return false;
    }
  }
  return true;
}

function isPossiblePassword(guess: number) {
  return /(\d)\1+/.test(guess.toString()) && hasDecreasingDigits(guess);
}

function isPossiblePasswordOneRepition(guess: number) {
  const matchingRegex = new RegExp(
    Array.from({ length: 10 })
      .map((_, i) => `(?<!${i})(${i}{2})(?!${i})`)
      .join('|')
  );
  return matchingRegex.test(guess.toString()) && hasDecreasingDigits(guess);
}

answer(1, async function() {
  const input = await getInput();
  let matches = 0;
  for (let i = input.start; i < input.end; i++) {
    if (isPossiblePassword(i)) {
      matches += 1;
    }
  }
  return matches;
});

answer(2, async function() {
  const input = await getInput();
  let matches = 0;
  for (let i = input.start; i < input.end; i++) {
    if (isPossiblePasswordOneRepition(i)) {
      matches += 1;
    }
  }
  return matches;
});
