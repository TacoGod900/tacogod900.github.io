# Local setup

This is the original [deltea/p3r-pause-menu](https://github.com/deltea/p3r-pause-menu) recreation, downloaded at commit `3adc18a`. Its source and visual design have not been changed. Dependencies were installed with npm; the generated `package-lock.json` records the installed versions.

## Run

Open a terminal in this folder and run:

```sh
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Visit http://127.0.0.1:5174 on a desktop-width browser. The original explicitly blocks narrow/mobile viewports. Widen the preview pane or open it in a full browser window if it reports an unsupported device.

The first screen lets you disable music and sound effects before pressing ENTER. This is a menu recreation, not yet a working personal portfolio: its menu labels and animations are present, but project submenus still need to be added.

## Main edit points

- `src/routes/+page.svelte`: menu labels, positions, intro, music and keyboard handling.
- `src/lib/components/Option.svelte`: option rendering and selection animation.
- `src/routes/layout.css`: fonts and styling.
- `static/background.mp4`: the original background, including the character; no personal photo has been added.
- `svelte.config.js`: already uses the Vercel adapter.

## Attribution and publication

Keep deltea's attribution. No LICENSE or other reuse grant was found in the downloaded repository. Clarify permission before distributing a modified public version. The bundled game media and fonts also need appropriate publication rights or replacements; permission for the application code alone would not settle those assets.

The earlier custom draft lives separately in `../portfolio/`; it is not this recreation.
