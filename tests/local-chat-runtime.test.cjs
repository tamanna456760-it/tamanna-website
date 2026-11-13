const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { URL } = require("node:url");

class Element {
  constructor(id = "") {
    this.id = id;
    this.children = [];
    this.listeners = {};
    this.value = "";
    this.textContent = "";
    this.disabled = false;
    this.style = {};
    this.attributes = {};
    this.className = "";
    this.scrollHeight = 24;
  }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = [...nodes]; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() {}
  get scrollTop() { return 0; }
  set scrollTop(value) { this._scrollTop = value; }
}

async function run() {
  const ids = ["messageInput", "sendButton", "chatBox", "newChatButton", "conversationSelect", "deleteConversationButton"];
  const elements = Object.fromEntries(ids.map(id => [id, new Element(id)]));
  const storage = new Map();
  let requestedUrl = "";
  const knowledge = {
    entries: [{
      id: "runtime-check",
      title: "Tamanna AI",
      keywords: ["Tamanna AI", "তামান্না এআই"],
      answer: "Tamanna AI runtime test answer"
    }]
  };
  const context = {
    document: {
      baseURI: "https://example.test/tamanna-website/",
      getElementById: id => elements[id] || null,
      createElement: () => new Element()
    },
    localStorage: {
      getItem: key => storage.has(key) ? storage.get(key) : null,
      setItem: (key, value) => storage.set(key, value)
    },
    fetch: async url => {
      requestedUrl = String(url);
      return { ok: true, status: 200, json: async () => knowledge };
    },
    URL,
    console,
    Set,
    Math,
    JSON
  };
  vm.runInNewContext(fs.readFileSync("js/chat.js", "utf8"), context, { filename: "js/chat.js" });
  assert.match(requestedUrl, /assets\/tamanna-knowledge\.json$/);
  elements.messageInput.value = "Tamanna AI কী?";
  await elements.sendButton.listeners.click();
  const visible = elements.chatBox.children.map(node => node.children.map(child => child.textContent).join(" ")).join("\n");
  assert.match(visible, /Tamanna AI runtime test answer/);
  assert.equal(elements.sendButton.disabled, false);
  assert.equal(elements.messageInput.value, "");
  assert.ok(storage.has("tamanna.local.chat.v1"));
  console.log("PASS: local knowledge loads, send click renders an answer, button recovers, and chat history persists.");
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
