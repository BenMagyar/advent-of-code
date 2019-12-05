import path from 'path';
import fs from 'fs-extra';
import { answer } from '../utils';

type Direction = 'L' | 'U' | 'R' | 'D';
type Movement = { direction: Direction; magnitude: number };
type Line = Array<Movement>;
type Coordinate = { x: number; y: number };
type Graph = Array<Coordinate>;

const CONSOLE_CENTER: Coordinate = { x: 0, y: 0 };

async function getLines(): Promise<Array<Line>> {
  const file = await fs.readFile(path.resolve(__dirname, './input.txt'));
  return file
    .toString()
    .split('\n')
    .filter(line => line.length > 0)
    .map(line => {
      const parts = line.split(',');
      return parts.map(part => {
        return {
          direction: part[0] as Direction,
          magnitude: parseInt(part.substring(1), 10)
        } as Movement;
      });
    });
}

function move(coordinate: Coordinate, movement: Movement): Graph {
  return Array.from({ length: movement.magnitude }).map((_, i) => {
    const totalMovement = i + 1;
    switch (movement.direction) {
      case 'D':
        return { x: coordinate.x, y: coordinate.y - totalMovement };
      case 'L':
        return { x: coordinate.x - totalMovement, y: coordinate.y };
      case 'R':
        return { x: coordinate.x + totalMovement, y: coordinate.y };
      case 'U':
        return { x: coordinate.x, y: coordinate.y + totalMovement };
    }
  });
}

function plotLine(line: Line): Graph {
  let coordinates: Array<Coordinate> = [CONSOLE_CENTER];
  for (let i = 0; i < line.length; i++) {
    coordinates = [
      ...coordinates,
      ...move(coordinates[coordinates.length - 1], line[i])
    ];
  }
  return coordinates.splice(1);
}

function isCoordinateEqual(coordinateA: Coordinate, coordinateB: Coordinate) {
  return coordinateA.x === coordinateB.x && coordinateA.y === coordinateB.y;
}

function findSharedCoordinates(graphs: Array<Graph>) {
  return graphs.reduce((a, b) =>
    a.filter(ac => !!b.find(bc => isCoordinateEqual(ac, bc)))
  );
}

function traversedLength(line: Line, coordinate: Coordinate) {
  let distance = 0;
  let coordinates = [CONSOLE_CENTER];
  for (let i = 0; i < line.length; i++) {
    let moves = move(coordinates[coordinates.length - 1], line[i]);
    for (let j = 0; j < moves.length; j++) {
      if (isCoordinateEqual(coordinate, moves[j])) {
        return distance + j + 1;
      }
    }
    coordinates = [...coordinates, ...moves];
    distance += moves.length;
  }
  return distance;
}

function manhattanDistance(coordinateA: Coordinate, coordinateB: Coordinate) {
  return (
    Math.abs(coordinateB.x - coordinateA.x) +
    Math.abs(coordinateB.y - coordinateA.y)
  );
}

answer(1, async function() {
  const lines = await getLines();
  const graphs = lines.map(plotLine);
  const intersections = findSharedCoordinates(graphs);
  return intersections.reduce((a, b) => {
    return Math.min(a, manhattanDistance(b, CONSOLE_CENTER));
  }, Infinity);
});

answer(2, async function() {
  const lines = await getLines();
  const graphs = lines.map(plotLine);
  const intersections = findSharedCoordinates(graphs);
  return intersections.reduce((a, b) => {
    return Math.min(
      a,
      lines.map(l => traversedLength(l, b)).reduce((a, b) => a + b)
    );
  }, Infinity);
});
