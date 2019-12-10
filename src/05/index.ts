import path from 'path';
import fs from 'fs-extra';
import { answer } from '../utils';

const AVAILABLE_PARAMETERS = [3, 4, 5];

enum OpCode {
  add = 1,
  multiply = 2,
  input = 3,
  output = 4,
  jumpIfTrue = 5,
  jumpIfFalse = 6,
  lessThan = 7,
  equals = 8,
  end = 99
}

enum ParameterType {
  position = 0,
  immediate = 1
}

type InstructionLength = 2 | 3 | 4;

interface Instruction {
  opcode: OpCode;
  parameters: Array<ParameterType>;
  length: InstructionLength;
}

type Memory = Array<number>;
type Input = number;
type Output = Array<number>;
type State = { memory: Memory; output: Output };

interface OpcodeInstructionLength {
  [opcode: number]: InstructionLength;
}

const OPCODE_INSTRUCTION_LENGTH: OpcodeInstructionLength = {
  [OpCode.add]: 4,
  [OpCode.multiply]: 4,
  [OpCode.input]: 2,
  [OpCode.output]: 2,
  [OpCode.jumpIfTrue]: 3,
  [OpCode.jumpIfFalse]: 3,
  [OpCode.lessThan]: 4,
  [OpCode.equals]: 4
};

async function initialMemory() {
  const file = await fs.readFile(path.resolve(__dirname, './input.txt'));
  return file
    .toString()
    .split('\n')[0]
    .split(',')
    .map(parseFloat);
}

function getDigit(value: number, n: number) {
  return Math.floor(value / 10 ** (n - 1)) % 10;
}

function nextInstruction(memory: Memory, pointer: number): Instruction {
  let opcode = memory[pointer];
  let shortenedOpCode = memory[pointer] % 100;
  switch (shortenedOpCode) {
    case OpCode.input:
      return {
        opcode,
        parameters: [ParameterType.immediate],
        length: OPCODE_INSTRUCTION_LENGTH[opcode]
      };
    default:
      return {
        opcode: shortenedOpCode,
        parameters: AVAILABLE_PARAMETERS.map(digit => getDigit(opcode, digit)),
        length: OPCODE_INSTRUCTION_LENGTH[shortenedOpCode]
      };
  }
}

function getParameters(
  memory: Memory,
  pointer: number,
  instruction: Instruction
) {
  return instruction.parameters.map((parameter, i) => {
    if (parameter === ParameterType.immediate) {
      return memory[pointer + i + 1];
    }
    return memory[memory[pointer + i + 1]];
  });
}

function run(
  input: Input,
  memory: Memory,
  pointer: number,
  output: Output = []
): State {
  const instruction = nextInstruction(memory, pointer);
  const parameters = getParameters(memory, pointer, instruction);

  function setToOutputMemoryAndRun(target: number, value: number) {
    memory[target] = value;
    return run(
      input,
      memory,
      pointer + (pointer === target ? 0 : instruction.length),
      output
    );
  }

  switch (instruction.opcode) {
    case OpCode.add:
      return setToOutputMemoryAndRun(
        memory[pointer + instruction.length - 1],
        parameters[0] + parameters[1]
      );
    case OpCode.multiply:
      return setToOutputMemoryAndRun(
        memory[pointer + instruction.length - 1],
        parameters[0] * parameters[1]
      );
    case OpCode.input:
      return setToOutputMemoryAndRun(parameters[0], input);
    case OpCode.output:
      output.push(parameters[0]);
      break;
    case OpCode.jumpIfTrue:
      if (parameters[0] !== 0) {
        return run(input, memory, parameters[1], output);
      }
      break;
    case OpCode.jumpIfFalse:
      if (parameters[0] === 0) {
        return run(input, memory, parameters[1], output);
      }
      break;
    case OpCode.lessThan:
      return setToOutputMemoryAndRun(
        memory[pointer + instruction.length - 1],
        parameters[0] < parameters[1] ? 1 : 0
      );
    case OpCode.equals:
      return setToOutputMemoryAndRun(
        memory[pointer + instruction.length - 1],
        parameters[0] === parameters[1] ? 1 : 0
      );
    case OpCode.end:
      return { memory, output };
  }

  return run(input, memory, pointer + instruction.length, output);
}

answer(1, async function() {
  const memory = await initialMemory();
  const { output } = run(1, memory, 0);
  return `Output ${output}`;
});

answer(2, async function() {
  const memory = await initialMemory();
  const { output } = run(5, memory, 0);
  return `Output ${output}`;
});
