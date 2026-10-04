# HG Portfolio

Run `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort` and open http://127.0.0.1:5174.

## Current version

The original start overlay is replaced by an HG Portfolio classroom title screen. Enter and Config use the original Option component, including its SVG text mask, pink/white selector and pop animation. Main navigation now opens About, Projects, Skills, Contact and Config. Screen changes use a short diagonal wipe; menu numbers use separate live transition elements. The original baked video lettering is covered with HENRYK on the main screen.

The classroom, project and about backgrounds contain no UI text. All headings, numbers, buttons and project content are live elements. The original main-menu video still animates; the new background plates are still images, not recreated 3D character animation. The HG logo is an original stepped vector approximation with outlined extrusion, not an exact licensed game-logo font.

Config includes SFX, music, motion, volume and defaults. Preferences are stored locally in the browser. Music starts off. Keyboard arrows select menu items; Enter confirms, Escape returns. The canvas scales to fit the viewport; desktop/landscape is the intended presentation and portrait phones use a letterboxed layout.

## Personalisation

- `src/lib/Portfolio.svelte`: screen flow, project entries, descriptions, settings.
- `src/lib/portfolio.css`: composition and transitions.
- `src/lib/components/Option.svelte`: original menu selector, now with activation and motion controls.
- `static/hg-logo.svg`: live vector logo.

Headcanon and Customer Zero are listed by explicit user request. Descriptions and demo URLs are intentionally left for the next pass. Public CoDrone, Kaggle and CS50 facts came from the GitHub connection. No other private repository details are included.

## Edited image provenance

The built-in image generator edited the user's supplied screenshots into clean background plates. The original files remain unchanged. Final assets are `static/classroom.png`, `static/projects-plate.png` and `static/about-plate.png`.

### Classroom prompt

Edit this exact screenshot into a clean background plate. Remove ONLY all overlaid typography and UI: upper right P3 PERSONA3 RELOAD logo, lower right NEW GAME LOAD GAME CONFIG menu with blue selection rectangle, and bottom right credits/end game prompts. Reconstruct the classroom wall, desks and clothing behind those text areas. Preserve the exact composition, every existing person/character silhouette, faces, poses, classroom geometry, blue/cyan palette, lighting and 16:9 framing. Do not add any new people, text or logos. This is a background for live HTML text overlay.

### Projects prompt

Edit exact screenshot to a clean UI background plate. Remove ALL text, the huge grey 9, every menu label top right, selection triangle, all ghosted black menu words, huge black SYSTEM typography on white, and bottom right help/button prompts. Preserve exactly the same character, standing pose, framing, blue circular/curved background containing cathedral stairway, water reflections and white outer area. Keep the character limbs exactly and restore any small character region obstructed by removed text. No new character. No typography or controls. 16:9.

### About prompt

Edit exact screenshot to clean UI background plate. Remove all text, setting labels, white selected bar, black control pills, sliders, huge CONFIG lettering and all bottom help prompts. Preserve exactly the existing character on right with the identical face, head angle, hair, eyes, hands, body, framing. Preserve the dark navy angular left panel and blue underwater background and plain white bottom strip behind the character. Removed UI areas on left become uninterrupted navy panel. No new people or text. 16:9.

## Attribution

Built on deltea/p3r-pause-menu. Original credit remains on the title screen. Existing publication/licensing considerations in LOCAL-SETUP.md still apply. This work has not been published.

## Skills correction

Skills now uses the supplied original game screenshot (`static/skills-reference.png`) under live inventory controls. The generated skill portraits and per-selection image swaps are no longer used. It uses flat, sharply edged panels without soft blending or blur. The reference is low resolution, so the character remains visibly lower resolution than the live text. Character pose is static; authentic pose-to-pose movement still needs transition footage or a rigged model. The original video is retained for the main menu only.

The inventory contains 12 technologies grounded in the public projects and this portfolio. Reset defaults is now a real button and restores saved preferences. Menu hit areas follow measured label widths. Title buttons reuse the original SVG Option component.

## Verified original assets — 2026-10-04

- `static/skills-status-1080.jpg`: original 1920×1080 Status / Team Summary screenshot, matching the user's 500×281 thumbnail exactly. Source: https://www.gameuidatabase.com/uploads/Persona-3-Reload02182024-103858-64282.jpg (gallery: https://www.gameuidatabase.com/gameData.php?id=1884). Retained reference only; superseded by the animated model below. No AI generation, upscaling, blur or image retouching. Live HTML panels cover the original UI.
- `static/official-fv1.mp4`: official 1920×1080, 6-second main-menu animation. Source: https://p3re.jp/resources/img/top/fv_movie1_bef3ec38c6b4ba869207fc85cf95bc78.mp4
- `static/official-fv2.mp4`: official 1920×1080, 6.667-second main-menu animation. Source: https://p3re.jp/resources/img/top/fv_movie2_1aaf21a0de60678450744da0dbaf9ef4.mp4

Both videos were discovered in the official https://p3re.jp/ page markup, downloaded unchanged and verified in the browser. They are retained as source assets, not used to impersonate Status-pose transitions. These videos do not contain the Status/Skills rig; the installed-game extraction below now supplies that rig. Artwork belongs to ATLUS / SEGA; gallery capture is credited to Game UI Database.


## Animated Skills character — 2026-10-04

Skills now renders the original PC0051 menu character from the user's installed Steam copy of Persona 3 Reload. The earlier screenshot background and PNG pose swaps are inactive. The 4 MB `static/menu-character.glb` contains the body, face, hair, skin weights and original Status, Item and Skill animation clips, converted from local game assets through CUE4Parse and Blender. The source installation was read only and was not modified.

`src/lib/MenuCharacter.svelte` uses Three.js for live skeletal playback. Selecting skills across Code, Data and Tools blends joint transforms over 650 ms and eases between matching cameras. The idle clips continue playing within each category. Facial and ribbon tracks are retargeted against the menu mesh's bind pose to account for the game's shared skeleton. The browser uses a custom crisp white/cyan toon shader; the camera framing and shader are adaptations, not an exact port of Unreal's rendering. The purple palm surface does not reproduce the game's live portrait render target.

The component loads only on Skills, honors Motion / reduced-motion preferences, disposes GPU resources on exit, and shows a retry message if WebGL or model loading fails. Original ATLUS / SEGA artwork and animations retain their attribution. Nothing was published.

Validation: Svelte check and production build passed. Browser verified original idle bone motion, all three active clips, pose blending, frozen reduced-motion playback, changing poses while motion is off, and cleanup on exit. No browser runtime errors in the navigation checks.
