# Tamanna AI Website

A responsive, local-first AI workspace starter for **Tamanna AI**.

## Current build

- Seven-color visual identity: violet, blue, cyan, green, gold, pink and orange
- Responsive chat interface and navigation
- Bundled local knowledge entries with simple keyword retrieval
- Optional browser conversation memory using `localStorage`
- Knowledge, Memory, Files placeholder, Activity and Settings views
- Dark and light appearance
- No Gemini, GPT, or external AI API calls

## Important model note

This is **not a newly trained AI model** and it is not equivalent to a general-purpose language model. The current reply engine searches a small curated local knowledge set and returns the closest matching entry. It is deliberately transparent and avoids fabricating answers when no match is found.

A genuinely independent local AI model would require choosing an open-weight model, obtaining its weights and license, running inference on suitable hardware, and optionally training or fine-tuning it on a curated dataset. That can be added later without connecting Gemini or GPT.

## Run locally

No build tools or package installation are required.

1. Download or clone this repository.
2. Open `index.html` in a modern browser, or serve the folder with any static web server.
3. Start chatting. The sample knowledge base is bundled in `app.js`.

Some browsers restrict local storage for files opened directly from disk; using a local static server is recommended.

## Deploy with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under Build and deployment, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then Save.
4. Wait for GitHub Pages to publish the site.

## Privacy and limitations

- No account or server authentication is included.
- Chat history is stored only in this browser when local memory is enabled.
- Do not enter passwords, API keys, or sensitive personal information.
- This starter does not yet upload or index files.
- A static website cannot securely provide server-side accounts or a shared database; those require a backend and security review.

## Project structure

- `index.html` — app structure
- `styles.css` — responsive visual design
- `app.js` — local chat, knowledge retrieval, navigation and memory

**Owner:** HM INSAN ALI
