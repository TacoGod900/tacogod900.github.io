# HG Portfolio

Henryk's portfolio, built as a playable Persona 3 Reload-style menu. Live at **https://tacogod900.github.io**.

- **About / Projects / Skills / Contact / Config** are navigated with the arrow keys, Enter and Esc, or with the mouse.
- The Projects screen opens each project with its description, links and screenshots (Headcanon includes a Loom demo).
- Skills is an inventory where every entry explains the tool and which projects use it.
- Settings (sound, music, motion, volume) are stored in the browser.

## Run locally

```sh
npm install
npm run dev
```

## Deploy

Every push to `main` builds the SvelteKit static site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.

## Credits

The menu foundation is [deltea/p3r-pause-menu](https://github.com/deltea/p3r-pause-menu). Persona 3 Reload artwork, music and fonts belong to ATLUS / SEGA and their respective owners; this is a non-commercial fan portfolio.
