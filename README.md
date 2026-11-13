# Tamanna AI Website

[🌐 Open Tamanna AI Chat](https://tamanna456760-it.github.io/tamanna-website/) · [🛡️ Open Tamanna Admin](https://tamanna456760-it.github.io/tamanna-website/admin/)

The previous standalone workspace homepage has been replaced with the Chat Panel from [Tamanna-](https://github.com/tamanna456760-it/Tamanna-). The Admin Control Center is available at `/admin/`. The official logo already used by this website repository is retained.

The Bengali Chat Panel sends guest messages to the configured FastAPI `POST /api/chat` endpoint at `https://www.bd-king-r7.com`. It includes a browser-tab conversation ID and recent context so guest chats can continue without login. The backend must allow the exact GitHub Pages origin in `TAMANNA_CORS_ORIGINS`; guest chat uses no cross-site cookies. Account login/history and the Admin panel still require the backend on the same origin because they use secure HttpOnly cookies. The Admin panel uses `GET /api/admin/overview` and `POST /api/auth/logout`. No Gemini, GPT or hosted model API is used.

**GitHub Pages is static hosting.** It serves the UI only; it does not host the FastAPI server or local Ollama model. The API host must be deployed and reachable over HTTPS before live AI replies work. Without that backend the Admin panel shows Preview Mode; it does not fake admin access or statistics.

**Owner:** HM INSAN ALI
