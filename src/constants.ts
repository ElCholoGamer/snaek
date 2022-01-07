import chalk from 'chalk';
import figlet from 'figlet';
import { GameOptions } from './types';

export const enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT,
}

export const menuTitle = (text: string) =>
	chalk.bold.green(figlet.textSync(text, { font: 'Chunky' }));

export const defaultOptions: GameOptions = {
	gridSize: 10,
	activeApples: 1,
	tickSpeed: 150,
	solidBorders: true,
};
