import ConfigStore from 'configstore';
import { defaultOptions } from './constants.js';
import { GameOptions } from './types.js';

const config = new ConfigStore('snaek', defaultOptions);

export function getGameOptions(): GameOptions {
	return config.all;
}

export function setOption(key: keyof GameOptions, value: GameOptions[keyof GameOptions]) {
	config.set(key, value);
}

export default ConfigStore;
