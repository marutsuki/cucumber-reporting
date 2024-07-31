# Cucumber Reportify

[![npm version](https://badge.fury.io/js/cucumber-reportify.svg)](https://badge.fury.io/js/cucumber-reportify)
[![Build Status](https://github.com/marutsuki/cucumber-reportify/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/marutsuki/cucumber-reportify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A performance optimized static HTML report page generator for Cucumber test results.

## Installation

You can install the library using npm:

```bash
npm install cucumber-reportify
```

Or using yarn:

```bash
yarn add cucumber-reportify
```

## Usage
You can run cucumber-reportify via the CLI:
```bash
cuke -i=path/to/reports/ -o=path/to/output/
```

## CLI Options
| Option | Description |
| --- | --- |
| `-i, --input` | Path to a JSON report or a directory containing JSON reports. |
| `-o, --output` | Path where the generated report should be saved. |
| `-v, --verbose` | Increase logging verbosity to debug mode. |
| `-t, --theme` | Report theme, can be any of the DaisyUI supported themes: https://daisyui.com/docs/themes/ |
| `-n, --app-name` | Application name to be displayed on the report. |
| `-f, --show-failed` | Show only failed features/scenarios on initial page load. |

## API
You can also render a report via `renderReport()`

```typescript
renderReport(reportPath, {
    // Path where the generated report should be saved
    outPath: "out",
    // Report theme
    theme: "dark",
    // Application name
    appName: "My App",
    // Show only failed features/scenarios on initial page load
    showFailed: true,
    // Increase logging verbosity to debug mode
    verbose: true,
});
```

## Contributing

Since this project is in pre-release and I'm not expecting it to blow out either, I am making direct changes to `/master`.

However, contributions are welcome!

## License
This project is licensed under the MIT License - see the LICENSE file for details.