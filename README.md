# StatPlanet

**Interactive maps, charts and data dashboards from your own data.**

StatPlanet is StatSilk's open-source, browser-based mapping and visualization software. Explore geographic, indicator and time-series data through an interactive dashboard with linked maps, graphs and filters.

Originally introduced in 2008, StatPlanet pioneered combining interactive maps and graphs in a web dashboard. StatSilk's mapping tools have been used by international organizations, public institutions and researchers. This repository contains the **HTML5/JavaScript open-source edition**, distinct from the StatPlanet Cloud commercial product.

[**Explore the project page**](https://statsilk.github.io/StatPlanet/) · [**Launch the included world-map demo**](https://statsilk.github.io/StatPlanet/StatPlanet_Cloud.html) · [**StatSilk website**](https://www.statsilk.com/software/statplanet-open-source)

## Features

- **Interactive maps**: explore world, national or subnational geographies; use GeoJSON maps of your own.
- **Linked charts**: compare data through maps, bars, time series and scatter/bubble visualizations.
- **Time exploration**: navigate indicators across years and animate changes.
- **Filters and search**: focus on geographic regions, categories and indicators.
- **Custom dashboards**: adapt panels, data sources, settings and presentation.
- **Data Manager**: prepare data and maps using the bundled Excel macro-enabled workbook.

## Quick start

1. Download or clone this repository.
2. For the easiest browser experience, **host the files via a local web server or a web host**. Do not assume that opening files directly from disk will work: browsers restrict some local-file requests.
3. Serve **`StatPlanet_Cloud.html`** and keep its `js/`, `data/` and `map/` folders together.
4. Explore the included world-map example, then review the PDF [Quick Start Guide](Quick_Start_Guide_StatPlanet_Cloud_v1.03.pdf) to customize it.
5. Use `StatPlanet_Data_Manager.xlsm` (requires a compatible Excel installation with macros) to prepare geographic, indicator and time data as described in the guide.

A basic local server example with Python 3:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/StatPlanet_Cloud.html`. Some bundled scripts may require additional compatibility work in modern browsers.

## Project files

| Path | Purpose |
| --- | --- |
| `StatPlanet_Cloud.html` | Existing dashboard entry point |
| `StatPlanet_Data_Manager.xlsm` | Excel-based data preparation |
| `Quick_Start_Guide_StatPlanet_Cloud_v1.03.pdf` | Setup and customization guide |
| `data/` | Example datasets and settings |
| `map/` | Map resources |
| `js/` | Dashboard and third-party JavaScript/CSS |
| `index.html` | Project landing page for GitHub Pages |

## Deploy on GitHub Pages

Under **Settings → Pages**, select **Deploy from a branch**, then `master` and `/(root)`. The landing page will appear at `https://statsilk.github.io/StatPlanet/`, and the interactive dashboard at `/StatPlanet_Cloud.html`. See [GitHub Pages setup and browser compatibility review](PAGES.md). GitHub Pages activation and live browser compatibility must be checked separately; committing files does not itself enable Pages.

## Licensing and third-party components

This repository includes a [GNU GPL v3 license](LICENSE) for the StatPlanet open-source project. It also bundles third-party libraries, including Highcharts files, **which may have separate licensing restrictions**. Do not assume that the GPL license grants a commercial license to all bundled third-party files. Review the Highcharts license terms and other dependency licenses before commercial redistribution or deployment.

## Maintenance status

Some bundled dependencies and browser assumptions may be outdated. A static review found a reference to a missing `js/highcharts-export-csv.js` file; see [PAGES.md](PAGES.md) for details and a browser test checklist. Review security, accessibility, licensing and browser compatibility before using in a production environment. The new landing page does not upgrade or modify the original visualization engine.

## About

Developed by [StatSilk](https://www.statsilk.com/), which creates tools to turn spreadsheets and databases into accessible maps and visualizations. Learn more about [StatPlanet Open Source](https://www.statsilk.com/software/statplanet-open-source) and [features](https://www.statsilk.com/features).
