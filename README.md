# Portfolio OS

A portfolio site styled as a custom desktop operating system. It uses plain HTML, CSS and JavaScript: no build step and no dependencies.

## Files

| File | What it is |
|---|---|
| `js/data.js` | **All your content.** Edit this file to change your name, bio, projects, skills and links. |
| `index.html` | The desktop experience (on phones it switches to a phone-style layout). |
| `plain.html` | The plain, scrollable view for recruiters, linked from the taskbar and the "Plain view" icon. |
| `css/styles.css` | All styles. Colors and fonts are set at the top as variables. |
| `js/app.js` | Boot screen, windows, taskbar and the Settings window. |
| `js/settings.js` | Visitor settings (theme, accent, wallpaper, motion, sound), saved in their browser. Accent presets live here. |
| `js/wallpaper.js` | The animated wallpapers: drifting lights, topographic, starfield and plain gradient. |
| `js/sound.js` | Interface sounds, generated in code (no audio files). |
| `js/plain.js` | Builds the plain view from `data.js`. |

## Adding your content

1. Open `js/data.js` and replace each placeholder.
2. Put images in an `assets/` folder, e.g. `assets/projects/my-game.png`, and set `image: "assets/projects/my-game.png"`. A 16:10 ratio works best. With `image: null` the site shows a generated cover.
3. Save your resume as `assets/resume.pdf`.
4. Optional: add `video: "https://www.youtube.com/embed/VIDEO_ID"` to a project to show a clip in place of the cover.

## Previewing locally

Open `index.html` in a browser, or run a small local server from this folder:

```powershell
python -m http.server 8080
```

Then visit http://localhost:8080.

The boot screen plays once per browser tab. Close the tab or clear session storage to see it again.

## Settings app

Visitors can change the theme (System, Light or Dark), the accent color, the wallpaper, motion and sounds. Choices are saved in their browser.

- The theme follows the visitor's device until they pick one.
- Motion follows their device's "reduce motion" setting until they change it.
- Sounds are on by default, but browsers keep pages silent until the first click or key press.
- To change the accent presets, edit `ACCENTS` in `js/settings.js`. `onLight` is a darker version of the color, used for text on the light theme.

## Deep links

- `index.html#projects` opens the Projects window
- `index.html#about`, `#skills`, `#contact`, `#resume`, `#settings`
- `index.html#project/game-one` opens a single project (uses the project's `id`)

## Deploying to GitHub Pages

1. Create a GitHub repository. Name it `<your-username>.github.io` for a site at `https://<your-username>.github.io`, or use any name for `https://<your-username>.github.io/<repo-name>`.
2. Push these files to the `main` branch.
3. In the repository, go to **Settings → Pages**, set **Source** to "Deploy from a branch", and pick `main` and `/ (root)`.
4. Wait about a minute, then open the URL GitHub shows.
