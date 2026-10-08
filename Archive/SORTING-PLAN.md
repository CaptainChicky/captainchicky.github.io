# Archive sorting plan

Surveyed 2026-10-08. Filesystem only: nothing in this plan was opened in a browser. Sizes are from a full recursive measure that day and are rounded to 0.1 MB.

This file is the handoff. Follow the phases in order. Do the work **in place** until Phase 9. Renaming a folder before its page actually runs is how the relative `images/` and `medias/` paths break.

When a phase is finished, check its box and commit that phase on its own. Do not commit coursework pages, the unsubscribe folder, or the adult-site scrapes as part of "organizing."

## How to test a page

Serve the repo from its root. Opening HTML with `file://` is the wrong test: absolute URLs fail, and some pages will not load scripts.

```powershell
cd C:\Users\conni\Documents\GitHub\captainchicky.github.io
python -m http.server 8080
```

Then open `http://localhost:8080/` plus the path under `Archive/`. Pass criteria for an interactive page:

- The feature you saved is on screen (for 2.1, the WebGL trailer, not a blank `#app`).
- Console has no 404s for scripts, images, or audio that the page needs. A browser-blocked autoplay until the first click is fine. A missing `medias/*.mp3` is not.
- Click through the screens that page has (characters, weapons, map, video popup).
- Reload once. The page has to boot from the files on disk, not from whatever a previous session cached.

## What a finished archive is

The model is:

`Archive/webstatic-sea.mihoyo.com/ys/event/e20210820-preview/`

That folder is Genshin Impact 2.1, "Floating World Under the Moonlight," saved from `https://webstatic-sea.mihoyo.com/ys/event/e20210820-preview/index.html`. It is about 18.6 MB and 89 files.

It is a small app, laid out the way the bundle expects:

| Path | Role |
|---|---|
| `index.html` (~5 KB) | Original shell. Body is `<div id="app"></div>`. Webpack runtime is inlined. Page bundles are loaded with relative `src`. |
| `vendors.8198dee274.js` (3.5 MB), `index.5210f53df8.js`, `styles.39698a8446.js`, `styles.00aa3a7cf44b253a0a6d.css` | The app. Hashed names stay as they are. |
| `images/` | Textures and UI the bundle requests as `images/<name>.<hash>.<ext>`. About 80 files. |
| `medias/bgm.7e0bcb13.mp3` (2.5 MB) | Background music. |
| `Archive/webstatic-sea.mihoyo.com/dora/` | Shared miHoYo runtime, one copy for every event. |

`dora/` currently contains:

| File | Size |
|---|---|
| `lib/vue-sentry/2.6.11/vue.min.js` | 148 KB |
| `biz/mihoyo-analysis/v2/main.js` | 11 KB |
| `biz/mihoyo-account-flow-sea/v1/main.js` | 197 KB |
| `biz/mihoyo-sea-footer/main.js` | 65 KB |
| `base/jquery-1.11.1.js` | 93 KB |
| `vconsole/3.2.0/vconsole.min.js` | 77 KB |

These are referenced by other events and are **not** in `dora/` yet:

- `dora/lib/vue/2.6.11/vue.min.js`
- `dora/lib/sentry/5.10.2/sentry.min.js`
- `dora/lib/sentry/5.10.2/sentry-vue.min.js`
- `dora/biz/mihoyo-account-flow-sea/v2/main.js`
- `dora/biz/mihoyo-event-login/v1/main.js`

Do not hotlink `webstatic-sea.mihoyo.com` to fill those gaps. Either the page runs after those script tags are removed, or you save that one file into `dora/` and point at it with a relative URL. Analytics and Sentry are removal candidates. Login and account-flow scripts mean the page is probably a login wall; those events are listed under "do not curate."

### What is still wrong on the 2.1 folder

Phase 1 fixes these. The folder shape is right; the HTML header is not.

In `e20210820-preview/index.html`:

- The `<title>` is empty. The Open Graph title is `Genshin Impact Version 2.1 "Floating World Under the Moonlight"`.
- `vue-sentry` and `mihoyo-analysis` use `https://captainchicky.github.io/Archive/webstatic-sea.mihoyo.com/dora/...`. That only works on the deployed site. From this folder the relative path is `../../../dora/...` (same pattern `e20210715-prepage/index.html` already uses).
- An inline `Sentry.init({...})` runs immediately after the Vue script. If that script fails, the console shows `Sentry is not defined`. Remove the init block. The trailer does not need Sentry.
- vConsole is a `data-src` on `https://captainchicky.github.io/.../dora/vconsole/3.2.0/vconsole.min.js`, so it does not load. Remove the tag.
- Favicon still points at `https://genshin.mihoyo.com/favicon.ico`. Drop the `<link>` or save a local icon. A remote favicon is a console 404.
- `og:image` / `twitter:image` still point at `webstatic-sea.mihoyo.com`. Browsers do not fetch those to render the page. Optional.

The inline webpack runtime sets `l.p = ""`, so asset URLs are relative to the HTML file. `images/` and `medias/` have to stay beside `index.html`. Do not rename hashed files.

### The Chrome save of 2.1 is a second, worse capture

These three are the same page and go away in Phase 1, after the folder above passes the browser test:

| Leftover | What it is |
|---|---|
| `Genshin Impact Version 2.1 _Floating World Under the Moonlight_.html` (135 KB) | Chrome "Webpage, Complete." Saved-from URL is the `e20210820-preview` index. The body is a frozen DOM, including a `<canvas id="webglCanvas">` from the moment you hit Ctrl+S. Reloading it does not rebuild the trailer. |
| `Genshin Impact Version 2.1 _Floating World Under the Moonlight__files/` (7 files, 4.2 MB) | The same CSS/JS as the good folder, saved as `.js.download`, plus a file literally named `js`, plus `vue.min.js.download`. No `images/`, no `medias/`. |
| `genshin2.1test.html` (5 KB) | An earlier shell. Scripts still point at `https://webstatic-sea.mihoyo.com/ys/event/e20210820-preview/...`. |

Chrome-save fingerprints, when you see them on anything else: a sibling folder named `<page>_files`, `.download` extensions, `saved from url=` on line 1, and injected extension nodes (`UMS_TOOLTIP`, `TAG_ID4TOOLBAR`). Wget fingerprints: a directory named after the host, filenames containing `@` where the query string was, `robots.txt.html` that is a copy of the index, and directories named `%3f...`.

## Do not touch

These are finished projects or live site files that happen to live in `Archive/`. This sorting pass does not move them.

Live homepage dependencies. `index.html` at the repo root references these exact paths:

- `Archive/PeacockIcon.png` (favicon)
- `Archive/AgentGame.js`
- `Archive/FairyDustCursor.js`

`Space/Articles/Particle-Physics/Neutrinos/neutrino_e.html` also points its `og:image` at `Archive/neutrino_e_files/neutrino_joke_e.jpg`. That folder was not in the archive at survey time. Leave the article alone; the image reference is already broken.

Finished projects and scratch that are not site captures:

| Path | Survey size | Why it stays |
|---|---|---|
| `FontTesting/` | 3.8 MB, 5 files | Encryption-font project. Its `archive/` subfolder (a Reddit thread and an Actively Learn page) belongs to that project. |
| `TestingStuff/` | 0.1 MB | Scratch page. Hard-codes `https://captainchicky.github.io/Archive/TestingStuff/...`. |
| `bin/` | 2.6 MB | BulletHell (`BulletHell.js`, `index.html`). |
| `bullethell-bb356c139c980c2ce9630928eec3d730b9a129cf/` | 1.3 MB | Older bullet-hell source. |
| `contests/USABO/` | 24.2 MB | Contest materials. Largest "leave it" item. |
| `box.timmyl1.repl.co/` | ~0 | repl.co export. |
| `calcformulasheet.timmyl1.repl.co/` | ~0 | repl.co export. |
| `csp-project-1--mukundvenkatesh.repl.co/` | 0.1 MB | repl.co export. |
| `math/ode-notes.html`, `math/sinkhorn-paper.html` | 0.1 MB | Your own notes, not a mirror. |
| `xjs/` | ~0 | Two local scripts. |
| `powworker.html`, `pow_worker.js` | ~0 | Unidentified. Grep the repo for `pow_worker` before ever moving them. |

## Where disk went

About 950 MB across the top-level listing. Two trees are most of it.

| Top-level | MB | Files | Disposition | Phase |
|---|---:|---:|---|---|
| `hungry-foxtail.sakura.ne.jp/` | 341.9 | 247 | Split. The site is ~20 MB. `game/` is 322 MB of binaries. | 5 |
| `webstatic-sea.mihoyo.com/` | 310.0 | 1191 | Genshin events. Curate version pages, delete the rest. | 1–4 |
| `jx3yq.xoyo.com/` | 37.6 | 268 | One campaign leaf, `zt/2021/06/04/fenliu`. | 6 |
| `www.toweroffantasy-global.com/` | 37.5 | 429 | Official site. Curate. | 6 |
| `mathinsight.org/` | 35.0 | 246 | Two triple-integral pages plus a fat `static/` tree. | 6 |
| `contests/` | 24.2 | 3 | Leave. | — |
| `jxgl.xoyo.com/` | 19.4 | 267 | One campaign leaf, `zt/2021/05/22/appointment`. | 6 |
| `apclassroom.collegeboard.org/` | 16.6 | 17 | Coursework. Do not curate. | 8 |
| `jx3.xoyo.com/` | 16.1 | 149 | A few date-tree leaves. See Phase 6. | 6 |
| `center4cretstudies.tripod.com/` | 15.3 | 101 | Old static site. | 6 |
| `GO GME! TO THE SUN!.png` | 13.3 | 1 | Loose image. | 8 |
| `www.visionlearning.com/` | 10.7 | 43 | Only Dalton's Playhouse. | 6 |
| `solutions.centogene.com/` | 9.0 | 17 | Saved medical/corporate page. Reading or drop. | 7 |
| `www.mathxl.com/` | 6.8 | 188 | Coursework. Do not curate. | 8 |
| `www.jakiecola.com/` | 5.3 | 13 | Keep this copy. Superset of `jakiecola.com/`. | 6 |
| Genshin 1.6 `_files` | 4.5 | 17 | Delete after `e20210603prepage` works. | 2 |
| Genshin 2.1 `_files` | 4.2 | 7 | Delete after Phase 1. | 1 |
| `DISEASES OF PEAFOWL_files/` | 4.2 | 66 | Article Chrome-save debris. | 7 |
| `waifulabs.com/` | 4.0 | 38 | Do not add to the catalog. | 8 |
| Distant Voyage `_files` | 4.0 | 10 | Delete after `e20210624-boat` works. | 2 |
| `1Genshin ..._files/` | 3.9 | 30 | Homepage snapshot. Park. | later |
| `FontTesting/` | 3.8 | 5 | Leave. | — |
| `jakiecola.com/` | 3.7 | 5 | Duplicate of `www.jakiecola.com/`. Delete after hash check. | 6 |
| `Genshin ... Adventure_files/` (no `1` prefix) | 3.5 | 32 | Second homepage snapshot, different day. Park. | later |
| `sakura.myacgcat.top/` | 3.4 | 37 | Broken-encoding scrape. Do not catalog. | 8 |
| `bin/` | 2.6 | 23 | Leave. | — |
| NRC classroom `_files` | 2.4 | 13 | Article debris. | 7 |
| `www.themostamazingwebsiteontheinternet.com/` | 2.0 | 5 | Small site. Easy. | 6 |
| `www.nimh.nih.gov/` | 1.8 | 52 | Article. | 7 |
| Sudden Death Syndrome `_files` | 1.8 | 37 | Article debris. | 7 |
| `54396576-E634-47E8-87A2-77FA3F5048A9.jpeg` | 1.6 | 1 | Loose image. | 8 |
| `bullethell-bb356c…/` | 1.3 | 13 | Leave. | — |
| `movieeditor.jx3.xoyo.com/` | 1.2 | 27 | Small tool. Curate. | 6 |
| everything else under ~1 MB | | | Listed in the phase that owns it. | |

GitHub warns on files over 50 MB and rejects files over 100 MB. `hungry-foxtail.sakura.ne.jp/game/download.php@name=KitsunemikoDefence&version=141029` is 68.7 MB. That matters if you keep the binaries and push them.

## Phase 1 — Make 2.1 the template

- [ ] Serve the repo and open `/Archive/webstatic-sea.mihoyo.com/ys/event/e20210820-preview/index.html`.
- [ ] Edit that `index.html` only:
  1. Set `<title>` to `Genshin Impact Version 2.1 "Floating World Under the Moonlight"`.
  2. Change the analysis script to `../../../dora/biz/mihoyo-analysis/v2/main.js`.
  3. Change the vue-sentry script to `../../../dora/lib/vue-sentry/2.6.11/vue.min.js`.
  4. Delete the inline `Sentry.init` script.
  5. Delete the vConsole `<script id="vconsole">` tag.
  6. Delete the remote favicon `<link>`, or point it at a file you actually have.
- [ ] Reload. Trailer renders, BGM file loads, character / weapon / map screens still switch, console is clean of missing-script errors.
- [ ] If the trailer white-screens only after you removed analysis or Sentry, put back the minimum script that fixed it and note which one in this file. Do not put the absolute `captainchicky.github.io` URLs back.
- [ ] Delete, only after the reload passes:
  - `Archive/Genshin Impact Version 2.1 _Floating World Under the Moonlight_.html`
  - `Archive/Genshin Impact Version 2.1 _Floating World Under the Moonlight__files/`
  - `Archive/genshin2.1test.html`

Done when the folder is the only 2.1 copy and it passes the test above on localhost.

## Phase 2 — The other version previews

Same edit as Phase 1, one folder at a time. Work in `Archive/webstatic-sea.mihoyo.com/ys/event/<id>/`.

Before editing an event, grep that `index.html` for `https://`. Classify each hit:

1. Shared library under `/dora/` → relative `../../../dora/...` if the file exists.
2. `sentry`, `mihoyo-analysis`, `vconsole` → remove the tag and any inline `Sentry.init`.
3. `account-flow` or `event-login` → remove the tag and load the page. If it mounts, you did not need the login SDK.
4. An `upload/` or `images/` URL on `webstatic-sea.mihoyo.com` or `uploadstatic-sea.mihoyo.com` → the file should already be under local `images/` or `medias/`. If the console 404s a hashed name, download that one file into the folder the bundle asked for. Do not mirror the host.
5. Favicon and `og:image` → same as Phase 1.

Pages that load **split** `vue/2.6.11/vue.min.js` plus `sentry/5.10.2/sentry*.js` can try the single local file `dora/lib/vue-sentry/2.6.11/vue.min.js` in place of that set. It exposes both `Vue` and `Sentry` on the pages that were built that way. If the console says `Vue is not defined` or a Sentry API is missing, save the missing file into `dora/` at the path the tag used, then point the tag at it. Record the new file in the `dora/` table at the top of this plan.

Suggested order, easiest structural match first:

| Order | Folder | Title | MB | Assets | Known remote scripts | Chrome-save to delete after it passes |
|---|---|---|---:|---|---|---|
| 1 | `e20210715-prepage` | No `<title>` in the file | 17.8 | images + medias | Already `../../../dora/` for vue-sentry and analysis. Still remove `Sentry.init` if present. | none |
| 2 | `e20210603prepage` | 1.6 Midsummer Island Adventure (`og:title`) | 9.2 | images + medias | analysis, vue-sentry | `Genshin Impact Version 1.6 - Midsummer Island Adventure.html` and `_files` (4.5 MB) |
| 3 | `e20210624-boat` | Distant Voyage. Confirmed by the Chrome save's saved-from URL. The event `index.html` itself has an empty description and no title. | 10.9 | images + medias | account-flow **v2** (not in `dora/`), vue-sentry, analysis | `Distant Voyage _ Genshin Impact.html` and `_files` (4.0 MB) |
| 4 | `e20210601blue_post` | "Genshin Impact - Version Preview Page" | 1.4 | images | vue 2.6.11, sentry 5.10.2 pair, analysis | none |
| 5 | `e20210309prediction` | 1.4 Invitation of Windblume | 14.8 | images, no medias dir | Re-grep. Not fully recorded. | none |
| 6 | `e20210128warmup` | 1.3 All That Glitters | 15.6 | images | vue, sentry, sentry-vue | none |
| 7 | `e20201216new` | 1.2 The Chalk Prince and the Dragon | 24.7 | images + medias | vue, sentry, sentry-vue | none |
| 8 | `e20210422newver` | 1.5 Beneath the Light of Jadeite | 33.4 | images + medias | vue, sentry, sentry-vue, analysis | none |

Per folder, done means: localhost reload shows the version page, console is clean, and the matching Chrome save (if any) is deleted.

`e20210624-boat` is the one most likely to throw after you strip account-flow v2. If a missing global stops the app from mounting, stub that global with an empty object in a tiny inline script, or save `dora/biz/mihoyo-account-flow-sea/v2/main.js` and link it relatively. Do not keep a `https://webstatic-sea.mihoyo.com` URL.

## Phase 3 — Optional Genshin events

Same recipe. Skip a row if you do not remember the page; a version trailer from Phase 2 is the priority.

| Folder | Title | MB | Notes |
|---|---|---:|---|
| `e20210122-slime` | Welcome to Slime Paradise! | 27.8 | images + medias. Remote vue + sentry pair. |
| `e20210219lantern` | Wish Upon a Lantern | 25.0 | images + medias. Re-grep scripts. |
| `sealamp_os` | Lantern Wish (Lantern Festival gift page) | 40.4 | Largest event. images + medias. Re-grep scripts. |
| `e20210316cooking-sea` | A Wanmin Welcome | 7.5 | images. Remote vue, sentry pair, analysis. |
| `e20210421-homeland` | Title not in the HTML | 16.9 | images + medias. Remote vue-sentry, account-flow v2, analysis. |
| `e20201109work` | 岩港奇珍行记 | 2.3 | images. Remote vue + sentry pair. |
| `e20210703drawing` | Empty `<title>`. Has a `fonts/` dir. | 5.2 | images + fonts. Remote vue-sentry. |
| `e20200410go_community` | Empty `<title>` | 1.3 | images. Re-grep. |
| `e20200220downfe` | No `index.html` | 3.2 | `medias/` only. Open the files. If they are not referenced by a page you kept, delete the folder. |

`e20210325-slime` is a 1-file "Welcome to Slime Paradise!" shell with no images. It is not a second copy worth keeping once `e20210122-slime` works.

## Phase 4 — Genshin folders that are not archives

Open the index once. If it is a login wall, an unsubscribe form, an empty shell, or a query-string duplicate, delete the folder. These are not going into `_raw` permanently; they are the bloat.

| Folder | MB | Why it goes |
|---|---:|---|
| `signin-sea` | 2.7 | Sign-in. Loads analysis, account-flow v1, vue, sentry. |
| `im-service` | 3.7 | Support widget. Empty title. |
| `qreminder-m` | ~0 | Title "miHoYo". One file. |
| `e20201028-invite-sea` | 5.1 | Invite flow. sea-footer + vue + sentry. |
| `e20210428invite` | 13.8 | Title 原神-再揽星辰. account-flow v2. |
| `e20200910-predrawcard-sea` | 2.6 | Predraw / gacha signup. |
| `e20200910-predrawcard-sea/%3fregion%3djp` | (inside the 2.6) | Same page with the query string saved as a directory. |
| `answer-question` | 5.2 | Loads event-login, account-flow v2, analysis. Login wall unless the quiz UI actually renders with those tags removed. If it renders, promote it to Phase 3 instead of deleting it. |
| `e20210325-slime` | ~0 | Empty shell of Slime Paradise. |
| `e20210520-homeland` | ~0 | Only `sea.html`. |
| `e20200424unsubscribe` | 0.3 | Folder name is a URL-encoded query string and it contains an email address. Delete the folder. Do not copy the address into a catalog, a commit message, or this file. |

After Phase 4, `webstatic-sea.mihoyo.com/` should contain `dora/` plus the event folders you actually got running.

### Parked on purpose: the Genshin homepage

Two Chrome saves of `https://genshin.mihoyo.com/en/home`, taken on different days (the inline `__NUXT__` payloads do not match; character image URLs differ):

- `1Genshin Impact – Step Into a Vast Magical World of Adventure.html` + `_files` (0.4 + 3.9 MB, 30 files)
- `Genshin Impact – Step Into a Vast Magical World of Adventure.html` + `_files` (0.4 + 3.5 MB, 32 files)

The `1` prefix means "another save," not "version 1." Leave both until you deliberately archive the marketing homepage. That page is a Nuxt dump whose images point at `uploadstatic-sea.mihoyo.com`. It is a different project from the event trailers. Do not start it in the middle of Phase 2.

## Phase 5 — hungry-foxtail

`hungry-foxtail.sakura.ne.jp` is 341.9 MB. It is two different things in one wget.

The website, about 20 MB:

| Path | Files | MB | Role |
|---|---:|---:|---|
| `index.html` | 1 | ~0 | 0.7 KB. Probably a frame or redirect. Open it first. |
| `top.html` | 1 | 0.2 | 233 KB. This is the real front page. |
| `gift.html` | 1 | ~0 | |
| `top_img/` | 91 | 7.0 | |
| `res_img/` | 50 | 3.7 | |
| `img/` | 13 | 0.5 | |
| `claplog/` | 23 | 2.4 | |
| `novel/` | 44 | 0.7 | |
| `ghost/` | 1 | 0.4 | |
| `counter/` | 1 | ~0 | `counter.php`. A server counter will not run as a static file. Leave the file if a page references it; expect it to fail closed. |

- [ ] Serve and open `top.html`. Fix root-relative or absolute URLs so `top_img/`, `res_img/`, and `img/` resolve.
- [ ] Click through `claplog/` and `novel/` the same way.
- [ ] `counter.php` and any other `.php` that is not a saved binary: if the HTML only used it as a hit counter, ignore the 404.

The binaries, 322 MB, in `game/` (18 files). Wget saved `download.php?name=...&version=...` as `download.php@name=...`. Several games were saved twice. Largest files:

| File (under `game/`) | MB |
|---|---:|
| `download.php@name=KitsunemikoDefence&version=141029` | 68.7 |
| `download.php@name=CrackleCradle&version=210208` | 54.1 |
| `download.php@name=Eodem&version=170912` | 34.8 |
| `download.php@name=Eodem&version=160130` | 33.9 |
| `download.php@name=Usurper&version=160919` | 25.7 |
| `download.php@name=DDProject&version=210809` | 25.2 |
| `download.php@name=Usurper&version=190505` | 24.0 |
| `download.php@name=BlankBlood&version=121008` | 23.8 |
| `download.php@name=KitsunemikoAct&version=180317` | 14.6 |
| `download.php@name=RYSTG&version=101010` | 6.1 |
| `download.php@name=Cardry&version=120802` | 4.7 |
| `download.php@name=FoxTale&version=101025` | 2.5 |
| `download.php@name=KitsuneKajiri&version=110321` | 2.3 |

`games/` is 3 files, 4.9 MB, including `ryona_action.zip` (2.0 MB) and `MouseRyonage.zip` (1.7 MB). List the third file before moving the directory; it was under the top-15 cutoff.

These do not become web pages. Decide once:

- Keep one version of each game: move `game/` and `games/` to `Archive/downloads/hungry-foxtail/`, delete the older of each pair (Eodem `160130`, Usurper `160919`, unless you specifically want the old build). Optionally check the first bytes and rename a `PK` zip to `.zip`. The 68.7 MB file will make `git push` warn.
- Or delete `game/` and `games/` entirely if you only wanted the webpage.

Do not leave them inside the host folder next to `top.html` after this phase. That mix is the current bloat.

## Phase 6 — Other sites that are a feature

One site per sitting. In-place fixes, then a localhost pass. Human folder names wait for Phase 9.

### Tower of Fantasy — `www.toweroffantasy-global.com/` (37.5 MB)

Already shaped like a finished archive: `index.html` (52 KB), `jquery-3.1.0.min.js`, `swiper-7.4.1.js`, `favicon.ico`, `assets/`, `images/`, `media/`.

`assets/` includes `bgm1.59cecc0e.mp3`, several page bundles (`main`, `ui`, `cms`, `login.250986ee.js` at 620 KB), CSS, and fonts. The fonts are a lot of the weight (`TT-GothicMB101Pro-Ultra` is 4.1 MB, two MPLUS1p files are ~1.7 MB each, `RoGSanSrfStd-UB` is 1.7 MB). Keep them if the page uses them.

- [ ] Localhost the `index.html`.
- [ ] Strip analytics the same way as Genshin.
- [ ] `login.*.js` is an account SDK. Remove it if the marketing page renders without it. If the official site is mostly a login wall plus a trailer, keep the trailer assets and drop the login bundle.
- [ ] Any 404 for a hashed file under `assets/`, `images/`, or `media/` gets downloaded into that folder. CDN hosts that are not this site get removed, not mirrored.

### Math Insight — `mathinsight.org/` (35.0 MB)

Two pages:

- `triple_integral_shadow_method.html`
- `triple_integral_cross_section_method.html`

Plus `static/` (Three.js, a full MathJax tree, KaTeX, CSS) and `media/`.

- [ ] Get both pages interactive on localhost, including the 3D figures.
- [ ] Leave the MathJax tree in place until both pages work. 35 MB is acceptable. Trimming unused MathJax files is a separate pass and is easy to get wrong (`static/MathJax/MathJax-master/` looks like a full checkout, with `package.json` and `composer.json`).

### Dalton's Playhouse — `www.visionlearning.com/library/animations/daltons_playhouse/`

The visionlearning mirror is only this animation (10.7 MB, 43 files). It is a Tumult Hype export: `index.html` plus `Dalton's_Playhouse_r8.hyperesources/`. The apostrophe in that folder name is load-bearing. Do not rename it until Phase 9, and when you do, update every reference in the HTML.

- [ ] Localhost `index.html` and click through the quiz. The SVG options live in the `.hyperesources` folder.

### JX3 movie editor — `movieeditor.jx3.xoyo.com/` (1.2 MB)

`index.html`, `Tutorial.html`, `FAQ.html`, `Copyright.html`, plus `css/`, `js/`, `images/`. This is the Xoyo item worth doing first. Make the four HTML files resolve their css/js/images locally.

### Other Xoyo trees

These are date-path campaign mirrors (`zt/year/month/day/<slug>`), not full sites. Leaves found at survey time:

| Path | Leaf |
|---|---|
| `jx3.xoyo.com/zt/2020/05/08/fenliuye-pc` | fenliuye, PC page |
| `jx3.xoyo.com/zt/2021/09/02/code` | slug is `code` |
| `jx3.xoyo.com/p/zt/2021/05/12/` | another directory level; not opened |
| `jx3.xoyo.com/assets/2018/11/26/assets` | shared assets, not a page |
| `jx3yq.xoyo.com/zt/2021/06/04/fenliu` | fenliu. This domain is 37.6 MB, so the weight is here. |
| `jxgl.xoyo.com/zt/2021/05/22/appointment` | appointment. This domain is 19.4 MB. |
| `xoyo.com/index.html` | 9.6 KB shell of 逍遥网 |

- [ ] Open each leaf's `index.html` on localhost.
- [ ] Keep a leaf that still shows its campaign page after relative-URL fixes.
- [ ] Delete a leaf that is an asset fragment or a login shell. `xoyo.com/index.html` goes if it is only a 10 KB frame pointing at the live site.

### Small interactive or single-page saves

| Path | MB | Saved from | What to do |
|---|---:|---|---|
| `www.jakiecola.com/` | 5.3 | (wget) | Keep. Has `index.html`, `style.css`, `index.js`, `assets/`, `safety.html`, and the same `jakiecola.mp4` (3.8 MB) plus `jakiecola.ogv` and `jakiecola.webm`. |
| `jakiecola.com/` | 3.7 | (wget) | Duplicate. Confirm the mp4 hash matches `www.jakiecola.com/jakiecola.mp4`, then delete this smaller tree. |
| `Velocity Raptor _ TestTubeGames.html` + `_files` | 0.3 | `https://testtubegames.com/velocityraptor.html` | Chrome save of a canvas game. Finish it in place: real script extensions, local assets, drop extension junk. This one may not have a wget twin, so the Chrome save is the only source. Rename `.download` files and fix the `src` that points at them. |
| `diep.io physics (c) spade-squad.com.html` + `_files` | 0.6 | `http://spade-squad.com/new%20physics` | Same Chrome-save repair. |
| `spade-squad.html` + `_files` | 1.7 | `http://spade-squad.com/physics.html` | Companion page. Do it with the diep one. |
| `trollface.dk/` | 0.4 | (wget) | Four files. Check `index.html` and keep. |
| `www.themostamazingwebsiteontheinternet.com/` | 2.0 | (wget) | Title in the file is `!@#$!@@@@@@@ MY ISYS PROJECT @@@@@@!%#@!@`. Check `index.html` and keep if it runs. |
| `Atom.html` + `Atom_files/` | 0.6 | `https://atom.io/` | Old Atom homepage. Chrome-save repair if you still want the snapshot. |
| `eternallybored.org/` | 0.7 | (wget) | `index.html` plus `misc/` tool blurbs (AHK, gimp, wget, netcat, pciutils, and others) and `imgs/`. `robots.txt.html` is 668 KB and is almost certainly a saved copy of a real page, not a robots file. Open it before deleting. |
| `ip.eternallybored.org/` | ~0 | (wget) | One file. Fold into the eternallybored check or delete. |
| `www.bamsoftware.com/` | ~0 | (wget) | `index.html` + `news.xml`. This is the copy to keep. |
| `www.bamsoftware.com.html` | ~0 | `https://www.bamsoftware.com/` | Chrome save. Delete after the folder copy renders. |
| `www.bamsoftware.com.htm` | ~0 | | Stray third copy. Delete after you glance at it. |
| `azurlane.yo-star.com/` | ~0 | (wget) | `index.html` is 2.4 KB plus `static/` and an empty `robots.txt.html`. Open it. If it is a shell whose assets were never downloaded, delete it. |
| `quiz.birdbot.xyz/` | 0.1 | (wget) | `index.html`, `static/`, and extensionless API dumps `getAllQuestions`, `getQuestion`, `getUserInfo`. Open it. Keep if it is your quiz and the JSON files are what the page fetches. |
| `center4cretstudies.tripod.com/` | 15.3 | (wget) | Static Tripod site. `index.html` and `id15.html` through `id27.html`, plus `sitebuildercontent/` and `imagelib/`. `imagelib/.../show_image.html@linkedwidth=...` files are Tripod's image viewer saved once per photo. Check three pages (`index.html`, `id15.html`, `id20.html`). If images in `sitebuildercontent/` load, keep the HTML and the image directory, and delete the `show_image.html@...` viewer files. |

## Phase 7 — Articles

These are documents. The finished form is one HTML file (or one PDF) that still shows the text and the figures you care about. Do not run the WebGL recipe on them.

For each Chrome save: open the HTML, confirm the article text is in the file, keep `<img>` sources that point at real pictures inside `_files`, and delete the rest of `_files` (`.js.download`, Google JSAPI, DataTables, fonts.css from the host's theme). Rewrite any surviving image `src` if you move the pictures next to the HTML.

| HTML | `_files` | Saved from |
|---|---|---|
| `DISEASES OF PEAFOWL.html` | 4.2 MB, 66 files | `https://unitedpeafowlassociation.org/articles/diseases-of-peafowl/` |
| `Sudden Death Syndrome_ why chickens sometimes die unexpectedly..html` | 1.8 MB, 37 files | `https://www.raising-happy-chickens.com/sudden-chicken-death.html` |
| `Classroom Activity _ NRC.gov.html` | 2.4 MB, 13 files | `https://www.nrc.gov/reading-rm/basic-ref/students/for-educators/classroom-activity.html` |
| `Sonar Propagation.html` | 0.1 MB, 25 files | `https://fas.org/man/dod-101/navy/docs/es310/SNR_PROP/snr_prop.htm` |
| `PRINCIPLES OF UNDERWATER SOUND Chapter 8.html` | ~0, 3 files | `https://fas.org/man/dod-101/navy/docs/fun/part08.htm` |
| `www.nimh.nih.gov/` | 1.8 MB, 52 files | wget of an NIMH page. Title in the file is the placeholder "title thing". Open `index.html` and keep it only if the article body is actually there. |
| `solutions.centogene.com/` | 9.0 MB, 17 files | wget. Open `index.html`. Keep one page if it is a document you wanted; delete the host folder if it is a brochure shell. |
| `kyoto.pdf` | 0.1 MB | Already a single file. Keep. |

## Phase 8 — Do not turn these into catalog entries

### Coursework

Session and assignment URLs are baked into the filenames (`PlayerHomework.aspx@homeworkId=...`, test result ids, College Board paths). Curating them will not produce a working page, and they do not belong on a public site.

- [ ] Delete `www.mathxl.com/` (6.8 MB, 188 files).
- [ ] Delete `apclassroom.collegeboard.org/` (16.6 MB, 17 files).
- [ ] Delete `mylab.pearson.com/` (0.1 MB).

If any of these are already in git history, deleting the working tree does not purge the history. That is a separate `git filter-repo` decision; do not do it as part of this sort.

### Scrapes that stay out of the catalog

Partial captures. Do not spend the Phase 6 recipe on them, and do not link them from `Archive/index.html`.

| Path | MB | Notes |
|---|---:|---|
| `gelbooru.com/` | 0.2 | A stylesheet and a handful of files. |
| `hentai-manga.porn/` | 0.4 | Template CSS/JS and a couple of SVGs. |
| `waifulabs.com/` | 4.0 | `index.html`, `static/`, `girls/`. |
| `nyanee.vip.html` + `nyanee.vip_files/` | 0.2 | Chrome save of `https://nyanee.vip/`. |
| `sakura.myacgcat.top/` | 3.4 | WordPress scrape. Directory names are mojibake. Includes `wp-login.php.html` and `wp-json/`. |
| `btcache.me - Torrent Cache - 7E914787065D346A04519DFC69E67CA9FCAABA12.html` + `_files` | 0.2 | One torrent-cache page. |

Delete them when you are ready to drop them from the repo. Until then, leave them out of every rename and every catalog.

### Loose files

Open each, then either keep it as a deliberate asset or delete it. None of these are sites.

| File | MB | Action |
|---|---:|---|
| `GO GME! TO THE SUN!.png` | 13.3 | Look at it. Delete if it is a meme you do not need on the site. It is a large file to keep by accident. |
| `54396576-E634-47E8-87A2-77FA3F5048A9.jpeg` | 1.6 | Same. The uuid name means it was dropped in, not archived. |
| `Cloud.png` | ~0 | Glance, then keep or delete. |
| `Does anybody ever read this text_.html` | ~0 | Scratch. Delete after you open it and confirm there is no note you need. |
| `test.html` | 0.1 | Same. |

## Phase 9 — Names and a catalog

Do this last, after Phases 1–6 pass on localhost **at their current paths**. Moving earlier invalidates every relative URL you just fixed.

Destination layout:

```
Archive/
  index.html                      catalog, this phase
  SORTING-PLAN.md                 keep until the sort is done, then delete or move out
  PeacockIcon.png                 stays. homepage
  AgentGame.js                    stays. homepage
  FairyDustCursor.js              stays. homepage
  FontTesting/                    stays
  TestingStuff/                   stays
  bin/                            stays
  bullethell-bb356c…/             stays
  contests/                       stays
  math/                           stays
  xjs/                            stays
  powworker.html                  stays until grepped
  pow_worker.js                   stays until grepped
  genshin/
    _dora/                        moved from webstatic-sea.mihoyo.com/dora
    2.1-floating-world/           e20210820-preview
    1.6-midsummer/                e20210603prepage
    1.5-jadeite/                  e20210422newver
    1.4-windblume/                e20210309prediction
    1.3-all-that-glitters/        e20210128warmup
    1.2-chalk-prince/             e20201216new
    distant-voyage/               e20210624-boat
    version-preview/              e20210601blue_post
    preview-e20210715/            e20210715-prepage, rename once you know which version it is
    …optional events, same idea
  sites/
    tower-of-fantasy/
    mathinsight/
    daltons-playhouse/
    jx3-movie-editor/
    jakiecola/
    velocity-raptor/
    diep-physics/                 both spade-squad pages
    trollface/
    most-amazing-website/
    atom/                         if you kept it
    eternallybored/               if you kept it
    bamsoftware/
    center4cretstudies/           if you kept it
    jx3-fenliuye/                 only leaves that passed
    jx3-fenliu/
    jx3-appointment/
  reading/
    diseases-of-peafowl.html
    sudden-death-syndrome.html
    nrc-classroom-activity.html
    sonar-propagation.html
    underwater-sound-ch8.html
    kyoto.pdf
  downloads/
    hungry-foxtail/               only if you kept the binaries
```

When you move a Genshin event from `webstatic-sea.mihoyo.com/ys/event/<id>/` to `Archive/genshin/<slug>/`:

- Move `images/`, `medias/`, `fonts/`, and the html/js/css with it, unchanged.
- Move `dora/` once, to `Archive/genshin/_dora/`.
- Rewrite only the `dora` script URLs. From `Archive/genshin/<slug>/index.html` the prefix is `../_dora/`.
- Do not rewrite `images/...` or `medias/...`.

`Archive/index.html` is a list of links to pages that passed localhost. One line each: name, date saved if you know it, original URL. Build it after the moves, then click every link on localhost.

Original URLs worth putting on that catalog, for the pages this plan already identified:

| Catalog name | Original URL |
|---|---|
| 2.1 Floating World | `https://webstatic-sea.mihoyo.com/ys/event/e20210820-preview/index.html` |
| 1.6 Midsummer | `https://webstatic-sea.mihoyo.com/ys/event/e20210603prepage/index.html` |
| Distant Voyage | `https://webstatic-sea.mihoyo.com/ys/event/e20210624-boat/index.html` |
| 1.5 Jadeite | `https://webstatic-sea.mihoyo.com/ys/event/e20210422newver/index.html` |
| 1.4 Windblume | `https://webstatic-sea.mihoyo.com/ys/event/e20210309prediction/index.html` |
| 1.3 All That Glitters | `https://webstatic-sea.mihoyo.com/ys/event/e20210128warmup/index.html` |
| 1.2 Chalk Prince | `https://webstatic-sea.mihoyo.com/ys/event/e20201216new/index.html` |
| Dalton's Playhouse | `www.visionlearning.com` mirror path `library/animations/daltons_playhouse/` |
| Velocity Raptor | `https://testtubegames.com/velocityraptor.html` |
| diep physics | `http://spade-squad.com/new%20physics` and `http://spade-squad.com/physics.html` |
| Atom | `https://atom.io/` |
| Tower of Fantasy | `www.toweroffantasy-global.com` |
| Math Insight | the two `triple_integral_*.html` pages |

## Order, if you only do some of it

1. Phase 1. It is small, and every later Genshin page copies it.
2. Phase 2, top to bottom. Delete each Chrome twin as soon as its folder passes.
3. Phase 5. That is the other half of the disk, and it does not depend on Genshin.
4. Phase 4, so the dead Genshin folders are gone before you forget which ones you rejected.
5. Tower of Fantasy, Math Insight, Dalton's Playhouse, movie editor.
6. Articles, then the deletions in Phase 8.
7. Phase 9 only when the pages you care about already run.

## Survey gaps

Filled in on purpose so a later pass does not treat silence as "empty":

- No page in this plan was loaded in a browser. "Passes" is still your job in each phase.
- `e20210715-prepage`, `e20210421-homeland`, and `e20210624-boat` have no `<title>` (boat's identity comes from the Chrome save). Name `e20210715-prepage` only after you see which version it is.
- `e20210309prediction`, `e20210219lantern`, `sealamp_os`, `e20200410go_community`, and `e20200220downfe` did not get a full script-tag inventory. The Phase 2 grep step covers that.
- `jx3.xoyo.com/p/zt/2021/05/12/` has at least one more directory level that was not listed.
- `hungry-foxtail.sakura.ne.jp/games/` has a third file besides the two zips named above.
- `www.nimh.nih.gov/index.html` and `solutions.centogene.com` were sized and not read.
- `quiz.birdbot.xyz` was not run.
