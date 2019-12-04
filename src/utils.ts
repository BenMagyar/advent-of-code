import chalk from 'chalk';

type Solution = () => Promise<any>;

export async function answer(part: number, solution: Solution) {
  const answer = await solution();
  console.log(
    chalk`The answer to part {green ${part}} is {blue {bold ${answer}}}`
  );
}
