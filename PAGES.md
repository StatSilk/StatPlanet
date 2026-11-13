# GitHub Pages publication & browser compatibility

## Publish the site

1. Visit **Settings → Pages** for this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Set **Branch: master**, **Folder: /(root)** and click **Save**.
4. Check the Pages deployment under **Actions**.

Expected page URLs (after deployment succeeds):
- Landing page: https://statsilk.github.io/StatPlanet/
- Interactive dashboard: https://statsilk.github.io/StatPlanet/StatPlanet_Cloud.html

The root `index.html` is an independent landing page; it does not require the bundled JavaScript visualization engine. The `.nojekyll` marker preserves direct static-file serving.

## Browser review

The dashboard uses bundled jQuery, Highcharts and other scripts. A static inspection of `StatPlanet_Cloud.html` identified these **possible compatibility issues**:

- Its loading manifest references `js/highcharts-export-csv.js`, which is **not present** in the tracked repository. This may trigger a resource-loading failure.
- The HTML calls `Pace.on` and `Pace.track`. A `pace.js` file exists under `js/unused/`, but its loading path could not be confirmed in the HTML. Verify whether a bundled script supplies this global.
- The HTML contains browser-detection text aimed at locally opened files, and uses an external CDN for jQuery 1.11.2. Both warrant modern-browser testing.
- Some third-party files have their own licensing rules, including Highcharts. The repository's GPLv3 license does not override those terms.

These are **inspection findings, not confirmed runtime failures**. The dashboard itself has not been fully executed in a modern browser during this update.

## Test checklist

- [ ] Landing page serves at its Pages URL and all internal links work.
- [ ] World-map demo loads without errors in browser developer tools.
- [ ] Map, chart, filtering and year controls respond to interaction.
- [ ] Browser Network tab shows no missing resources (especially the export-CSV dependency).
- [ ] Verify data requests load from `data/` and `map/`.
- [ ] Confirm whether CSV/chart exports still work.
- [ ] Check desktop and mobile display and keyboard navigation.
- [ ] Audit third-party licenses and outdated dependencies before production use.

If the demo cannot launch, prioritize an isolated compatibility fix in a separate pull request, preserving existing behavior and checking for third-party licensing implications.
