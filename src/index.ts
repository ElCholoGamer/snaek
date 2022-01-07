import Game from './game';

Game.initInput();

const game = new Game({ gridSize: 10, activeApples: 1 });
game.run();
