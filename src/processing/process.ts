import * as fs from 'fs';
import { Feature } from './types';

export default function processFeature(filePath: string): Feature[] {
    console.info('Processing...');
    const feature: Feature[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.debug('Processed feature:', filePath);
    return feature;
}
