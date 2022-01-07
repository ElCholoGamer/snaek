export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function waitForKeyPress() {
	process.stdin.setRawMode(true);
	process.stdin.resume();

	return new Promise<void>(resolve => {
		process.stdin.once('data', () => {
			process.stdin.setRawMode(false);
			resolve();
		});
	});
}

export function centerText(text: string, width: number, fill = ' ') {
	const space = width - text.length;
	if (space <= 0) return text;

	const lowerHalf = Math.floor(space / 2);
	const upperHalf = Math.ceil(space / 2);

	return fill.repeat(lowerHalf) + text + fill.repeat(upperHalf);
}
