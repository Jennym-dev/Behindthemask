# Behind the Mask — Wiki

Plain HTML / CSS / JavaScript, no build step. Open `index.html` in a browser.

## Files

```
index.html            Home
characters.html       Characters
story.html            Story
chapters.html         Chapters
characters/           One page per character (raven, titan, ghost, shade, viper, chaos)
page-template.html    Copy-from template showing every component (not linked in the menu)
neon-rain.html        Your original animated background (untouched)

assets/css/wiki.css   All styling — colours, fonts and sizes are at the top (:root)
assets/js/site.js     Builds the shared parts: background, top bar, footer
assets/js/rain.js     The rain animation from neon-rain.html (settings in CFG)
assets/img/           background.jpg (from neon-rain.html), logo-nav.webp, logo-hero.webp
```

## Adding content

Each page has an empty-state block marked `Page content goes here`. Replace it
with your text.

## Adding a new page

1. Copy `page-template.html`, rename it, and delete the blocks you don't need.
2. Set `<body data-page="your-id">` and change the `<title>`.
3. To show it in the top menu, add it to `SITE.nav` in `assets/js/site.js`.
4. For a page inside a sub-folder (e.g. `characters/name.html`), add `data-root="../"`
   to `<body>` and prefix the CSS/JS/image paths in its `<head>` with `../`.

## Adding a character

1. Copy `characters/raven.html` to `characters/<name>.html` and replace the text.
   Keep the same info-box rows (Nickname, Role, Route, Personality) for everyone;
   write `—` when something is unknown.
2. Pictures: put them in `assets/img/` and list one
   `<img class="gallery__slide" src="../assets/img/…">` line per picture.
   The left/right buttons appear automatically when there is more than one.
3. Add one line to `SITE.characters` in `assets/js/site.js` — this creates the
   character's button on the Characters page and adds them to the Characters
   dropdown in the top menu. Set `group: 'main'` (Main Routes) or `group: 'other'`
   (Secondary Routes). Leave `image: ''` until there is a picture —
   a black frame is shown instead.

## Components (see page-template.html)

Page header + breadcrumb · section headings · cards · grid · infobox (character
profile) · character cards · chapter list · tables · expandable / spoiler
sections · images with captions · notes & warnings · tags · buttons · prev/next.

## Customising

- **Colours / fonts / panel opacity:** `:root` in `wiki.css`
  (`--c-panel` is the 90%-opaque panel background).
- **Panel width:** `--wiki-width` — sized to the gap between the characters.
- **Rain:** `CFG` in `rain.js` (density, wind, speed, splashes).
- **Footer text:** `SITE.footer` in `site.js`.
