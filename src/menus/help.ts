import chalk from 'chalk';
import { drawChars, menuTitle } from '../constants.js';
import { waitForKeyPress } from '../utils.js';

async function helpMenu() {
	const help = [
		'Use the WASD keys to move.',
		`Grab apples (${drawChars.apple}) and avoid crashing into your body (${drawChars.snakeBody}).`,
	];

	console.clear();
	console.log(menuTitle('How to Play'));
	console.log(chalk.bold(help.join('\n')));
	console.log();
	console.log('Press any key to continue...');

	await waitForKeyPress();
}

export default helpMenu;
