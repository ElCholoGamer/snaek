import ConfigStore from 'configstore';
import { defaultOptions } from './constants.js';

const config = new ConfigStore('snk', defaultOptions);

export function getGameOptions() {
	return config.all;
}

export default ConfigStore;
