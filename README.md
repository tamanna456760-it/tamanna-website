# Tamanna AI Website

<div align="center">

**A responsive, local-first AI workspace — built without Gemini, GPT, or external AI APIs.**

[🌐 Open Tamanna AI Website](https://tamanna456760-it.github.io/tamanna-website/)

[View source code](https://github.com/tamanna456760-it/tamanna-website) · [Deployment status](https://github.com/tamanna456760-it/tamanna-website/actions)

</div>

> **Website preview:** Use the **Open Tamanna AI Website** link above to launch the interactive website. GitHub README pages cannot embed a fully working website inside the Markdown document; this prominent link opens the actual site.

## Features

- Responsive AI chat interface and navigation
- Seven-color theme: violet, blue, cyan, green, gold, pink and orange
- Dark and light appearance
- Local curated knowledge search (no cloud AI API)
- Browser conversation memory using `localStorage`
- Knowledge library and activity/settings views
- Import TXT, Markdown, JSON and CSV documents locally (up to 2 MB per file); imported text is available to chat search for the current browser session
- Automated website tests and GitHub Pages deployment workflow

## Important AI model note

This website does **not** contain a newly trained general-purpose AI model. Its current response engine searches a small curated local knowledge set and any documents imported during the current browser session. It does not use Gemini, GPT, or another external AI API.

A genuinely independent local AI model requires model weights, a compatible inference runtime and suitable hardware. Training or fine-tuning also requires a prepared dataset and compute resources.

## Run locally

No package installation is required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser, or serve this directory using a static web server.
3. Start using Tamanna AI.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

1. Open **Settings → Pages** in this repository.
2. Set the source to **GitHub Actions**.
3. Push to `main`, or manually run the workflow from **Actions**.
4. After a successful deployment, open: https://tamanna456760-it.github.io/tamanna-website/

If the preview link does not open yet, check the Actions deployment status and the repository's Pages settings. A successful build alone does not mean the website has been published.

## Privacy and limitations

- No account system, backend authentication or shared server database is included.
- Conversation memory is stored in this browser when enabled.
- Imported documents are read locally in the browser and are not uploaded; they are cleared when the page session is refreshed.
- Do not enter passwords, API keys or sensitive personal information.
- A static website cannot securely provide server-side accounts or a shared database.

## Project structure

- `index.html` — website structure and views
- `styles.css` — responsive design and themes
- `app.js` — local chat, knowledge retrieval, document import, navigation and memory
- `tests/test_website.py` — automated website checks
- `.github/workflows/pages.yml` — build, test and Pages deployment

**Owner:** HM INSAN ALI
