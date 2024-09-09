# Cucumber Reporting

[![npm version](https://badge.fury.io/js/cucumber-reporting.svg)](https://badge.fury.io/js/cucumber-reporting)
[![Build Status](https://github.com/marutsuki/cucumber-reporting/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/marutsuki/cucumber-reporting)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


A performance optimized static HTML report generator for Cucumber test results.

## Installation

You can install the library using npm:

```bash
npm install cucumber-reporting
```

Or using yarn:

```bash
yarn add cucumber-reporting
```

## Usage

You can run cucumber-reporting via the CLI:
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

You can also render a report through code:

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

## Serving Locally

The JS scripts loaded into the HTML uses `fetch()`, which won't work off a local file system and will require a HTTP server.

There are many fast ways to spin up a HTTP server. Examples include:

- The [http-server](https://www.npmjs.com/package/http-server) npm package:
  - `npm install http-server -g`
  - `http-server`
- Python's built in `http.server` package:
  - `python3 -m http.server 8080`
  - Or Python 2: `python -m SimpleHTTPServer 8080`
- Ruby's WEBrick HTTP server:
  - `ruby -run -ehttpd . -p8000`

## Performance Testing

GitHub pages deployment of the static content generated by this package with dummy data:

[Performance Test](https://marutsuki.github.io/cucumber-reporting-perf-test/)

## Contributing

Since this project is in pre-release and I'm not expecting it to blow out either, I am currently making direct changes to `/master`.

However, contributions are welcome!

## License
This project is licensed under the MIT License - see the LICENSE file for details.