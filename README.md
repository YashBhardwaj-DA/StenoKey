# StenoKey

A clean, distraction-free touch-typing trainer built for stenographers, transcriptionists, and anyone who wants to type faster without losing accuracy.

No sign-up, no backend, no tracking. Everything runs in the browser, and the only thing ever saved is your own best scores — on your own device.

**Live demo:** (https://stenokey.netlify.app/)

---

## What it does

StenoKey is organized around three tabs:

- **Practice** — the typing area itself. Pick a module and a drill, click into the box, and start typing. Live meters track your words-per-minute, accuracy, error count, and elapsed time as you go.
- **Modules** — a library of nine drills, ordered from foundational to advanced, each with a short description of what it trains. Click any card to load it straight into Practice.
- **Stats** — your personal-best WPM and accuracy per module, plus how many times you've run each one. Stored locally; nothing is sent anywhere.

### Modules included

| # | Module | Focus |
|---|--------|-------|
| 1 | Home Row | Anchoring fingers on A S D F · J K L ; |
| 2 | Reach Keys | Top and bottom row stretches |
| 3 | Common Words | High-frequency English words |
| 4 | Short Sentences | Word-to-word flow |
| 5 | Capitals & Punctuation | Shift, commas, periods, quotes |
| 6 | Numbers & Symbols | Figures, currency, dates, references |
| 7 | Tricky Pairs | Letter combinations that slow typists down |
| 8 | Shorthand-Style Lines | Dense, semicolon-joined dictation-style clauses |
| 9 | Full Paragraphs | Sustained prose for pacing and endurance |

Every drill is original content written for this project — nothing is copied from any institution's coursework.

### Features

- **Live error highlighting** — correct characters turn green as you type; mistakes turn red immediately, so you feel the difference between clean and rough typing in real time.
- **Real-time WPM, accuracy %, error count, and timer**, recalculated continuously during the drill.
- **Dark mode toggle**, remembered across visits, with a default that follows your OS preference on first load.
- **Local best-score tracking** via `localStorage` — your top WPM and accuracy per module, and your last-used module/drill, persist across sessions without any account or server.
- **Free switching between modules and difficulty levels** — nothing is locked behind progress; jump from drill 1 to drill 9 any time.
- **Shuffle and restart controls** for quick re-practice of a module without manually picking a new line each time.
- **Rotating typing tips** shown beneath the practice area.
- **Responsive, keyboard-accessible UI** with visible focus states and a reduced-motion fallback.

---

## Tech stack

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no dependencies to install.

```
stenokey/
├── index.html      # markup for all three tabs + result modal
├── style.css       # design system (light + dark themes)
├── modules.js       # drill content — the only file you'd edit to add/change drills
├── app.js          # typing engine, stats, theme, navigation
└── README.md
```

This was a deliberate choice: a typing trainer doesn't need a framework, and a single static bundle means it can be hosted anywhere for free, opened offline, or dropped into any existing site with zero integration work.

---

## Running it locally

Because the app uses `fetch`-free, dependency-free vanilla JS, you can simply open `index.html` in a browser. For a smoother local experience (so relative paths and fonts behave exactly like production), serve it over a tiny local server instead of using `file://`:

```bash
# Python (already installed on most systems)
python3 -m http.server 8080

# or Node, if you have it
npx serve .
```

Then visit `http://localhost:8080`.

---

## Deployment

StenoKey is a fully static site — any static host works. A few common options:

### GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Netlify
1. Drag and drop the project folder into [app.netlify.com/drop](https://app.netlify.com/drop), or connect the GitHub repo.
2. No build command needed — leave it blank. Publish directory: `/`.

### Vercel
1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. No build command needed. Output directory: `/`.

### Cloudflare Pages
1. Connect the repo at [pages.cloudflare.com](https://pages.cloudflare.com).
2. Build command: leave empty. Build output directory: `/`.

Whichever host you choose, point your custom domain's DNS at it afterward (see suggested names below).

---

## Customizing or extending

- **Add a drill or module:** open `modules.js` and either add a new string to an existing module's `lines` array, or add a new object to the `MODULES` array following the existing shape (`id`, `title`, `level`, `levelLabel`, `description`, `lines`).
- **Add a tip:** add a string to the `TIPS` array in `modules.js`.
- **Change the palette or fonts:** all design tokens live at the top of `style.css` under `:root` and `html[data-theme="dark"]`.
- **Reset your own local stats:** use the "Clear all saved stats" button on the Stats tab, or clear `localStorage` for the site in your browser's dev tools.

### Ideas for future scaling
These weren't built in (to keep the first version simple and dependency-free), but the codebase is structured to make them straightforward additions later:
- Per-finger heatmap of error rates, to show which keys need the most work.
- A "custom text" mode where a user pastes in their own paragraph to practice against.
- Timed-mode drills (e.g. "type for 60 seconds, see how far you get") alongside the current fixed-text drills.
- Exportable/importable stats (JSON download) for users who switch browsers or devices.
- A leaderboard, if a backend is ever added — current architecture keeps all state local specifically so this remains optional, not required.

---

## Privacy

StenoKey makes no network requests other than loading its own files and two Google Fonts. No analytics, no cookies, no accounts. The only persisted data is in your browser's `localStorage`, scoped to whichever domain the site is hosted on, and it never leaves your device.

---

## License

MIT — use it, fork it, teach with it.
