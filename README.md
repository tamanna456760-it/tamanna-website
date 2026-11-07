# Tamanna AI Website

<div align="center">

**A polished, responsive local-first AI workspace for conversations, knowledge and documents.**

[🌐 Open Tamanna AI Website](https://tamanna456760-it.github.io/tamanna-website/)

[Source code](https://github.com/tamanna456760-it/tamanna-website) · [GitHub Actions](https://github.com/tamanna456760-it/tamanna-website/actions)

</div>

> GitHub README pages cannot run an interactive website inline. Use the website link above to open the complete experience. The live link becomes available after GitHub Pages deployment succeeds.

## Website features

- **Professional workspace UI:** responsive sidebar, navigation, chat composer and clean content views
- **Chat:** local question search, starter prompts, conversation interface and new-chat action
- **Conversations:** locally saved chat history, recent chat shortcuts and conversation search
- **Knowledge base:** built-in reference library, searchable entries and source labels
- **My documents:** import TXT, Markdown, JSON and CSV files (up to 500 KB each, 10 per session); imported text is searchable in chat
- **Activity:** transparent local workspace event list and basic system overview
- **Settings:** seven accent colors (violet, blue, cyan, green, gold, pink and orange), dark/light mode, compact sidebar, local workspace name, memory toggle
- **Data tools:** export saved conversations and preferences as JSON, or reset local data
- **Mobile support:** responsive layout, mobile navigation and touch-friendly controls
- **Accessibility basics:** semantic sections, visible labels, keyboard focus and reduced-motion support
- **No external AI APIs:** no Gemini, GPT or cloud AI API calls

## Important model disclosure

This website does **not** contain a newly trained general-purpose AI model. Its current response engine performs keyword-based retrieval over a small curated knowledge library and documents imported during the current browser session. It returns relevant stored text when it finds a match; it does not provide general-purpose reasoning or generate original answers like a trained language model.

A genuinely independent local AI model requires open model weights, a compatible inference runtime and suitable hardware. Training or fine-tuning additionally requires a prepared dataset and compute resources.

## Privacy and limitations

- Saved conversations and preferences are stored in this browser using `localStorage`; they are not synced to a server.
- Imported document text is processed locally and held in memory for the current page session. Refreshing or closing the page clears imported documents.
- This static website does not provide online user accounts, server-side authentication, encrypted cloud storage or multi-device synchronization.
- Do not enter passwords, API keys or sensitive personal information.
- Local browser storage is not a substitute for a secure encrypted database.

## Run locally

No package installation is required.

1. Clone or download this repository.
2. Open `index.html` in a modern browser, or serve this directory using a static web server.
3. Start using Tamanna AI.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at `.github/workflows/pages.yml`.

1. Open [Repository Pages settings](https://github.com/tamanna456760-it/tamanna-website/settings/pages).
2. Set **Build and deployment → Source** to **GitHub Actions** if the setting is available.
3. Push to `main`, or manually run the workflow from [Actions](https://github.com/tamanna456760-it/tamanna-website/actions).
4. Wait for both the build and deploy jobs to succeed.
5. Open: https://tamanna456760-it.github.io/tamanna-website/

A successful build alone does not mean the website is published. GitHub Pages must be enabled for the repository and the deploy job must finish successfully.

## Project structure

- `index.html` — complete website structure and workspace views
- `styles.css` — responsive professional design, themes and seven-color palette
- `app.js` — local chat retrieval, conversation history, document import, navigation and settings
- `tests/test_website.py` — automated website checks
- `.github/workflows/pages.yml` — validation and GitHub Pages deployment

**Owner:** HM INSAN ALI
