import Game from './game';

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf-8');

const game = new Game({ gridSize: 10, activeApples: 1 });
game.run();
