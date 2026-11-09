# Tamanna AI Website

[🌐 Open Tamanna AI Chat](https://tamanna456760-it.github.io/tamanna-website/) · [🛡️ Open Tamanna Admin](https://tamanna456760-it.github.io/tamanna-website/admin/)

The previous standalone workspace homepage has been replaced with the Chat Panel from [Tamanna-](https://github.com/tamanna456760-it/Tamanna-). The Admin Control Center is available at `/admin/`. The official logo already used by this website repository is retained.

The Bengali Chat Panel includes account UI, settings and chat composer. Its frontend uses FastAPI `POST /api/chat`, `GET /api/history`, and `/api/auth/*`. The Admin panel uses `GET /api/admin/overview` and `POST /api/auth/logout`. No Gemini, GPT or hosted model API is used.

**GitHub Pages is static hosting.** The panels display on Pages, but real login, live AI responses, persistent chat and live admin data require the FastAPI backend on the same origin. Without that backend the Admin panel shows Preview Mode; it does not fake admin access or statistics. The backend uses local Ollama.

**Owner:** HM INSAN ALI
