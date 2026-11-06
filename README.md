# David Li Zhongyuan

My bilingual personal portfolio, built with HTML, CSS, JavaScript, and a locally bundled copy of Three.js.

**Website:** https://davidli1127.github.io/

- Scroll-driven 3D camera, draggable profile badge, and interactive workbench
- Expandable experience and project details
- Chinese and English content and résumé PDFs
- Dark and light themes, responsive layouts, and reduced-motion support

## Run locally

Open `index.html`, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Edit

- `portfolio-3d.js`: bilingual copy, experience, projects, and interactions
- `portfolio-3d.css`: typography, themes, and layout
- `world-3d.js`: 3D scene and camera choreography
- `assets/`: photos, résumés, brand assets, and the local Three.js library

The site is static and does not require a build step. GitHub Pages serves the root of `main`.

Three.js is distributed under the MIT license in `assets/vendor/THREE-LICENSE.txt`. GitHub and LinkedIn marks belong to their respective owners; asset sources are documented in `assets/icons/SOURCES.txt`.

## AI interview assistant

The site includes 小D (Xiao D), David’s AI counterpart, with Gemini 3.5 Flash and a LangGraph workflow on a separate Cloudflare Worker. It speaks in first person using approved résumé/project knowledge, shows sources, and can open the relevant portfolio section. Intent-specific writing skills and relevant voice examples keep replies concise and natural. The website itself remains static.

See [agent-service/README.md](agent-service/README.md) for local setup, the private owner interview studio, deployment, free-tier limits, privacy and evaluation. `agent-config.js` contains only the public backend URL, never an API key.
