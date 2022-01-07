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
