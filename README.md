# Tamanna AI Website

<div align="center">

**Tamanna AI — Chat Panel + Admin Control Center**

[🌐 Open Tamanna AI Chat](https://tamanna456760-it.github.io/tamanna-website/)

[🛡️ Open Tamanna Admin](https://tamanna456760-it.github.io/tamanna-website/admin/)

[Source repository](https://github.com/tamanna456760-it/Tamanna-) · [Website repository](https://github.com/tamanna456760-it/tamanna-website) · [GitHub Actions](https://github.com/tamanna456760-it/tamanna-website/actions)

</div>

## Imported panels

The previous standalone workspace homepage has been replaced with the Tamanna AI chat panel from the `Tamanna-` repository. The Admin Control Center is published at `/admin/`.

- User Chat: Bengali chat interface, sign-in/sign-up panel, preferences and chat composer.
- Admin Control Center: admin overview, access state, backend/model/database status and management module overview.
- The existing official Tamanna AI logo from this website repository is retained.
- Responsive styles, account/settings scripts, memory/knowledge/model health UI and PWA shell are included.
- Chat frontend uses FastAPI `POST /api/chat`, `GET /api/history`, and `/api/auth/*`.
- Admin frontend uses `GET /api/admin/overview` and `POST /api/auth/logout`.
- No Gemini, GPT, or hosted model API is used.

## GitHub Pages limitation

GitHub Pages is static hosting. The Chat and Admin panels load as website interfaces, but real account login, live AI generation, chat persistence and live admin data require the FastAPI backend to be deployed and connected on the same origin. On GitHub Pages without that backend, the Admin panel explicitly shows Preview Mode and login/chat API calls are unavailable. No fake authentication or fabricated live statistics are shown.

The backend uses local Ollama for inference. GitHub Pages does not run Python or Ollama.

## Deployment

GitHub Actions validates assets and JavaScript, runs website tests, then deploys to GitHub Pages.

- Chat: https://tamanna456760-it.github.io/tamanna-website/
- Admin: https://tamanna456760-it.github.io/tamanna-website/admin/

**Owner:** HM INSAN ALI
