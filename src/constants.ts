import chalk from 'chalk';
import figlet from 'figlet';

export const enum Direction {
	UP,
	RIGHT,
	DOWN,
	LEFT,
}

export const menuTitle = (text: string) =>
	chalk.bold.green(figlet.textSync(text, { font: 'Chunky' }));
