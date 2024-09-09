import { ProcessedFeature } from '@ui/template-prep';
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

addListeners(window.config.showFailedOnStart);
