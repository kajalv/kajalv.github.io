# kajalv.github.io

My personal website, served at [kajalv.com](https://kajalv.com) via GitHub Pages.

Plain HTML, CSS, and vanilla JS. No build step and no frameworks.

- `index.html`: all content
- `css/site.css`: styles, with light/dark theme tokens at the top
- `js/site.js`: theme toggle, mobile nav, live clock, career-uptime chart (edit the `CAREER` data to update it), certification status

After editing `css/site.css` or `js/site.js`, update its `?v=` in `index.html` (first 8 characters of `shasum <file>`). Pages caches these files for a day, so without a new version visitors get the old file with the new page.

To preview locally, run `python3 -m http.server` and open http://localhost:8000.

See [CHANGELOG.md](CHANGELOG.md) for the design notes behind each version.

Design and development by me.
