import chalk from 'chalk';
import { menuTitle } from '../constants.js';
import { waitForKeyPress } from '../utils.js';

async function helpMenu() {
	const help = [
		'Use the WASD keys to move.',
		'Grab apples (\u25cf) and avoid crashing into your body (\u25a0).',
	];

	console.clear();
	console.log(menuTitle('How to Play'));
	console.log(chalk.bold(help.join('\n')));
	console.log();
	console.log('Press any key to continue...');

	await waitForKeyPress();
}

export default helpMenu;
