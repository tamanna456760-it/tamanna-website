/* Tamanna AI — API-free, browser-local knowledge chat.
 * No fetch to AI endpoints. Answers are retrieved from the static knowledge file.
 */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const input = $("messageInput"), send = $("sendButton"), box = $("chatBox");
  if (!input || !send || !box) return;

  const STORAGE_KEY = "tamanna.local.chat.v1";
  const KNOWLEDGE_URL = "assets/tamanna-knowledge.json";
  const STOP = new Set(["আমি","আমার","তুমি","আপনি","এবং","কী","কি","কেন","কিভাবে","হয়","হবে","হয়","একটা","এই","the","a","an","is","are","to","of","and","what","how","why","you","your","i"]);
  let entries = [];
  let turns = [];
  let busy = false;

  function tokens(value) {
    return String(value || "").toLocaleLowerCase()
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter(word => word.length > 1 && !STOP.has(word));
  }

  function add(role, value) {
    const item = document.createElement("div");
    item.className = "message " + (role === "user" ? "user-message" : "ai-message");
    const name = document.createElement("div");
    name.className = "message-name";
    name.textContent = role === "user" ? "আপনি" : "Tamanna AI · Local";
    const body = document.createElement("div");
    body.className = "message-text";
    body.textContent = String(value ?? "");
    item.append(name, body);
    box.append(item);
    box.scrollTop = box.scrollHeight;
    return item;
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-60))); } catch (_) {}
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      turns = Array.isArray(saved) ? saved.filter(x =>
        x && ["user","assistant"].includes(x.role) && typeof x.content === "string"
      ).slice(-60) : [];
    } catch (_) { turns = []; }
    box.replaceChildren();
    if (!turns.length) {
      add("assistant", "হ্যালো! আমি Tamanna AI-এর API-free local assistant। আমি এই ওয়েবসাইটের স্থানীয় জ্ঞানভান্ডার থেকে উত্তর খুঁজি।");
    } else {
      turns.forEach(x => add(x.role, x.content));
    }
  }

  function scoreEntry(queryTokens, entry) {
    const words = new Set(tokens([entry.title, ...(entry.keywords || []), entry.answer].join(" ")));
    let score = 0;
    queryTokens.forEach(word => {
      if (words.has(word)) score += 1;
      if ((entry.keywords || []).some(k => String(k).toLocaleLowerCase().includes(word))) score += 2;
    });
    const query = queryTokens.join(" ");
    if (query && (entry.keywords || []).some(k => String(k).toLocaleLowerCase() === query)) score += 5;
    return score;
  }

  function localAnswer(prompt) {
    const q = prompt.trim().toLocaleLowerCase();
    if (/^(ধন্যবাদ|thanks|thank you|অনেক ধন্যবাদ)[!.\s]*$/i.test(q))
      return "আপনাকে স্বাগতম! Tamanna AI-এর স্থানীয় জ্ঞানভান্ডারে আর কোনো প্রশ্ন থাকলে করতে পারেন।";
    if (/^(বিদায়|বিদায়|bye|goodbye)[!.\s]*$/i.test(q))
      return "আবার কথা হবে! আপনার local chat history এই browser-এ সংরক্ষিত থাকবে।";
    const queryTokens = tokens(q);
    if (!queryTokens.length) return "একটু বিস্তারিত লিখুন—আমি স্থানীয় জ্ঞানভান্ডারে মিলিয়ে দেখব।";
    const ranked = entries.map(entry => ({entry, score:scoreEntry(queryTokens, entry)}))
      .sort((a,b) => b.score - a.score);
    if (ranked.length && ranked[0].score >= 2) return ranked[0].entry.answer;
    return "এই প্রশ্নের নির্ভরযোগ্য উত্তর এখনো আমার local knowledge file-এ নেই। API ছাড়া এই সংস্করণে আমি অনুমান করে উত্তর দেব না। জ্ঞানভান্ডারে তথ্য যোগ করলে সেই বিষয়েও উত্তর দিতে পারব।";
  }

  async function loadKnowledge() {
    try {
      const response = await fetch(KNOWLEDGE_URL, {cache:"no-cache"});
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      entries = Array.isArray(data.entries) ? data.entries : [];
    } catch (_) {
      entries = [];
      add("assistant", "স্থানীয় জ্ঞানভান্ডার লোড হয়নি। assets/tamanna-knowledge.json ফাইলটি প্রকাশিত হয়েছে কি না পরীক্ষা করুন।");
    }
  }

  const knowledgeReady = loadKnowledge();

  async function sendMessage() {
    const prompt = input.value.trim();
    if (!prompt || busy) return;
    busy = true;
    send.disabled = true;
    send.textContent = "…";
    input.value = "";
    input.style.height = "auto";
    add("user", prompt);
    await knowledgeReady;
    const answer = localAnswer(prompt);
    add("assistant", answer);
    turns.push({role:"user",content:prompt},{role:"assistant",content:answer});
    turns = turns.slice(-60);
    save();
    busy = false;
    send.disabled = false;
    send.textContent = "↑";
    input.focus();
  }

  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 180) + "px";
  });
  $("newChatButton")?.addEventListener("click", () => {
    turns = [];
    save();
    box.replaceChildren();
    add("assistant", "নতুন local chat শুরু হয়েছে। কী জানতে চান?");
    input.value = "";
    input.focus();
  });

  const select = $("conversationSelect");
  if (select) {
    select.disabled = true;
    select.title = "Local mode-এ browser-এর বর্তমান chat history রাখা হয়; server conversation list নেই।";
  }
  const remove = $("deleteConversationButton");
  if (remove) remove.disabled = true;

  restore();
  loadKnowledge();
})();
