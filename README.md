# Tamanna AI Website

[🌐 Open Tamanna AI Chat](https://tamanna456760-it.github.io/tamanna-website/) · [🛡️ Open Tamanna Admin](https://tamanna456760-it.github.io/tamanna-website/admin/)

The previous standalone workspace homepage has been replaced with the Chat Panel from [Tamanna-](https://github.com/tamanna456760-it/Tamanna-). The Admin Control Center is available at `/admin/`. The official logo already used by this website repository is retained.

The Bengali Chat Panel now runs in **API-free local knowledge mode**. Questions are processed in the browser and matched against `assets/tamanna-knowledge.json`; chat history is stored in that browser's local storage. No question is sent to FastAPI, Gemini, GPT, or another hosted model API. This is local retrieval, not a full generative LLM: when an answer is absent from the knowledge file, the assistant says so instead of guessing. Add entries to the JSON knowledge file to expand its coverage.

**GitHub Pages is static hosting.** It can serve the UI and local knowledge file, but cannot run a Python server or Ollama. A full generative model without an API would require downloading and running a compatible browser-side model (WebGPU/WebAssembly), which is a separate, larger feature. The Admin panel remains Preview Mode without a trusted backend.

**Owner:** HM INSAN ALI
