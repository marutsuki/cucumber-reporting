import { renderToStaticMarkup } from 'react-dom/server';
import CucumberReport from '../ui';
import { TestSuite } from './types';

export default function render(model: TestSuite): string {
    console.info('Rendering...');
    return renderToStaticMarkup(<CucumberReport model={model} />);
}
