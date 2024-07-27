import { renderToStaticMarkup } from 'react-dom/server';
import CucumberReport from '../ui';

export default function render(model: TestSuite): string {
    console.info('Rendering...');
    return renderToStaticMarkup(<CucumberReport model={model} />);
}
