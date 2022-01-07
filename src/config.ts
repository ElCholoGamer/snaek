import ConfigStore from 'configstore';

const config = new ConfigStore('snaek', {
	gridSize: 10,
	activeApples: 2,
	tickSpeed: 150,
});

export function getGameOptions() {
	return config.all;
}

export default ConfigStore;
