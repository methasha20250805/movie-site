[README.md](https://github.com/user-attachments/files/30010762/README.md)
# NOW SHOWING — Movie & Entertainment Guide

A 4-page static website for browsing and discovering movies, built with plain HTML, CSS and JavaScript, with movie data stored in an external XML file.

## Folder contents

```
movie-guide/
├── index.html          Home page — hero, genre nav, featured films
├── movies.html         All Films page — full catalog with JS genre filtering
├── movie-detail.html   Film detail page — reads ?id= from the URL
├── form.html            Review form page with JS validation
├── css/
│   └── styles.css      All styling for every page
├── js/
│   └── script.js       XML loading/parsing, filtering, detail rendering, form validation
├── data/
│   └── movies.xml      20 films across Action, Comedy, Drama, Science Fiction
└── README.md
```

## How to run it

Because the site loads `data/movies.xml` with `fetch()`, most browsers block that request when a page is opened directly from disk (`file://…`). Two ways to view it correctly:

**Option A — quick local server (recommended)**
1. Open a terminal in the `movie-guide` folder.
2. Run: `python3 -m http.server 8000` (or `npx serve`).
3. Visit `http://localhost:8000` in your browser.

**Option B — just double-click index.html**
The site also works this way: if the XML fetch is blocked, `js/script.js` automatically falls back to an identical copy of the movie data embedded in the script, so every page still functions normally.

## Features

- **Home page** — marquee-style hero, an interactive genre navigation bar (Action / Comedy / Drama / Science Fiction), and a featured-films strip.
- **All Films page** — every movie in a "ticket stub" card grid, filterable instantly by genre using JavaScript (no page reload), with a live results count and empty-state message.
- **Film detail page** — reads the film's `id` from the URL query string, looks it up in the parsed XML, and renders title, genre, year, rating, runtime, director and synopsis.
- **Review form page** — name, email, film picker (populated from the XML), star rating, and review text, all validated with JavaScript before a success message is shown. No data leaves the browser in this demo.
- **Accessibility** — skip-to-content link, semantic landmarks (`header`, `nav`, `main`, `footer`), labeled form fields with inline error messages, visible focus states, `aria-live` regions for dynamic content, sufficient color contrast on the dark theme, and `prefers-reduced-motion` support.

## Editing the movie catalog

Add, remove or edit films by editing `data/movies.xml`. Each `<movie>` needs a unique `id` attribute and `title`, `genre`, `year`, `rating`, `director`, `runtime` and `synopsis` child elements. Genre must be one of: `Action`, `Comedy`, `Drama`, `Science Fiction` for the styling and filters to pick it up correctly. If you rely on Option B (no local server), also update the matching entry in the `FALLBACK_XML` string near the top of `js/script.js`.
