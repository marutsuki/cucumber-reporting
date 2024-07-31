import { ProcessedFeature } from 'src/processing/types';
import { loadTries } from './trie';
import engine from './engine';
import addListeners from './listeners';

type PartitionData = {
    providers: (() => Promise<ProcessedFeature[][]>)[];
    pages: number;
};

declare global {
    interface Window {
        data: PartitionData;
        failed: PartitionData;
        config: {
            showFailedOnStart: boolean;
        };
    }
}

if (window.config.showFailedOnStart) {
    console.info('Showing failed features only on load');
}

loadTries();
engine.setFailedOnly(window.config.showFailedOnStart);
addListeners(window.config.showFailedOnStart);
