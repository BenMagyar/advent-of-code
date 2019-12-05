import chalk from 'chalk';

type Solution = () => Promise<any>;

export async function answer(part: number, solution: Solution) {
  const start = new Date().getTime();
  const answer = await solution();
  const end = new Date().getTime();
  console.log(
    chalk`The answer to part {green ${part}} is {blue {bold ${answer}}} {grey ${end -
      start}ms}`
  );
}
