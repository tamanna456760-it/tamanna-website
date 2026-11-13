/* Tamanna AI guest-first chat. Login is optional; guest turns stay in this browser tab. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const input = $("messageInput");
  const send = $("sendButton");
  const box = $("chatBox");
  const newChat = $("newChatButton");
  const select = $("conversationSelect");
  const remove = $("deleteConversationButton");

  if (!input || !send || !box) return;

  const configuredBase = (
    document.querySelector('meta[name="tamanna-api-base"]')?.content ||
    window.TAMANNA_API_BASE ||
    ""
  ).trim();
  const apiBase = configuredBase.replace(/\/+$/, "");
  const apiUrl = (path) => apiBase + path;
  const isGitHubPages = /(^|\.)github\.io$/i.test(window.location.hostname);
  const isCrossOrigin = Boolean(apiBase) && new URL(apiBase, window.location.href).origin !== window.location.origin;
  const requestCredentials = isCrossOrigin ? "omit" : "same-origin";
  const storageKey = "tamanna.guest.chat.v1";

  let busy = false;
  let conversationId = "";
  let turns = [];

  function makeId() {
    return window.crypto?.randomUUID
      ? window.crypto.randomUUID().replace(/-/g, "")
      : "guest" + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function restoreGuestSession() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
      conversationId = typeof saved.conversationId === "string" ? saved.conversationId : "";
      turns = Array.isArray(saved.turns)
        ? saved.turns.filter((turn) =>
            turn && ["user", "assistant"].includes(turn.role) &&
            typeof turn.content === "string"
          ).slice(-20)
        : [];
    } catch (_) {
      conversationId = "";
      turns = [];
    }
    if (!conversationId) conversationId = makeId();
  }

  function saveGuestSession() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        conversationId,
        turns: turns.slice(-20)
      }));
    } catch (_) {
      // Chat remains usable for the current page even when storage is unavailable.
    }
  }

  async function api(path, options = {}) {
    const response = await fetch(apiUrl(path), {
      credentials: requestCredentials,
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = typeof data.detail === "string"
        ? data.detail
        : data.detail?.message || data.message;
      const error = new Error(detail || "HTTP " + response.status);
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function add(role, value) {
    const element = document.createElement("div");
    element.className = "message " + (role === "user" ? "user-message" : "ai-message");

    const name = document.createElement("div");
    name.className = "message-name";
    name.textContent = role === "user" ? "আপনি" : "Tamanna AI";

    const body = document.createElement("div");
    body.className = "message-text";
    body.textContent = String(value ?? "");

    element.append(name, body);
    box.append(element);
    box.scrollTop = box.scrollHeight;
    return element;
  }

  function renderSavedTurns() {
    box.replaceChildren();
    if (!turns.length) {
      add("assistant", "আমি Tamanna AI। কীভাবে সাহায্য করতে পারি?");
      return;
    }
    turns.forEach((turn) => add(turn.role, turn.content));
  }

  async function history() {
    if (!window.TamannaAuth?.getUser()) return;
    try {
      const data = await api("/api/history");
      box.replaceChildren();
      (Array.isArray(data.history) ? data.history : []).forEach((pair) => {
        if (pair.user !== undefined) add("user", pair.user);
        if (pair.assistant !== undefined) add("assistant", pair.assistant);
      });
      if (!box.children.length) add("assistant", "আমি Tamanna AI। কীভাবে সাহায্য করতে পারি?");
    } catch (error) {
      add("assistant", "আগের কথোপকথন লোড করা যায়নি: " + error.message);
    }
  }

  function explainConnectionError(error) {
    if (error.status === 405 || error.status === 404) {
      return "AI API endpoint পাওয়া যায়নি (HTTP " + error.status + ")। GitHub Pages static hosting API চালায় না। API URL হিসেবে https://www.bd-king-r7.com সেট করুন এবং একই origin-এ Tamanna FastAPI server deploy করুন।";
    }
    if (error instanceof TypeError) {
      return "Tamanna AI server-এ সংযোগ করা যায়নি। API server চালু আছে কি না, API URL, HTTPS এবং backend CORS allowlist-এ এই website origin আছে কি না পরীক্ষা করুন।";
    }
    return "AI server উত্তর দিতে পারেনি (" + error.message + ")। Backend health এবং local model runtime পরীক্ষা করুন।";
  }

  async function sendMessage() {
    const prompt = input.value.trim();
    if (!prompt || busy) return;

    add("user", prompt);
    input.value = "";
    input.style.height = "auto";
    busy = true;
    send.disabled = true;
    send.textContent = "…";

    const waiting = add("assistant", "Tamanna AI উত্তর তৈরি করছে…");
    const previousTurns = turns.slice(-10);

    try {
      const data = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: prompt,
          conversation_id: conversationId,
          context: previousTurns
        })
      });

      const answer = data.reply ?? data.response ?? data.answer;
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("সার্ভার থেকে খালি বা অচেনা response এসেছে।");
      }

      waiting.querySelector(".message-text").textContent = answer;
      turns.push({ role: "user", content: prompt }, { role: "assistant", content: answer });
      turns = turns.slice(-20);
      saveGuestSession();
    } catch (error) {
      const text = waiting.querySelector(".message-text");
      text.textContent = explainConnectionError(error);
      text.classList.add("tamanna-error");
    } finally {
      busy = false;
      send.disabled = false;
      send.textContent = "↑";
      input.focus();
      box.scrollTop = box.scrollHeight;
    }
  }

  restoreGuestSession();
  renderSavedTurns();

  send.addEventListener("click", sendMessage);
  newChat?.addEventListener("click", () => {
    conversationId = makeId();
    turns = [];
    saveGuestSession();
    renderSavedTurns();
    input.value = "";
    input.focus();
  });

  if (select) {
    select.disabled = true;
    select.title = "অ্যাকাউন্টে লগইন করার পর সংরক্ষিত কথোপকথন দেখানো হবে।";
  }
  if (remove) {
    remove.disabled = true;
    remove.title = "এই API সংস্করণে conversation delete endpoint নেই।";
  }

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  window.addEventListener("tamanna:authenticated", history);
  window.addEventListener("tamanna:loggedout", () => {
    box.replaceChildren();
    add("assistant", "আপনি লগআউট করেছেন। Guest হিসেবে নতুন চ্যাট করতে পারেন।");
  });

  if (window.TamannaAuth?.getUser()) history();

  if (isGitHubPages && !apiBase) {
    console.warn("[Tamanna AI] GitHub Pages requires a separately hosted API base URL.");
  }
})();
