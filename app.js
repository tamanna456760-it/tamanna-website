const knowledge = [
  {title:"What is Tamanna AI?",category:"About",color:"violet",body:"Tamanna AI is a local-first assistant workspace. This starter website demonstrates a chat interface, a small searchable knowledge library, browser-based conversation memory, and privacy-conscious settings."},
  {title:"Local mode and APIs",category:"Privacy",color:"green",body:"This version does not call Gemini, GPT, or any external AI API. The reply engine searches a bundled knowledge set using simple keyword overlap. It is a prototype, not a trained large language model."},
  {title:"How local knowledge works",category:"Knowledge",color:"cyan",body:"The browser compares words in your question with titles and text in the bundled knowledge entries. It returns the best matching entry when enough keywords overlap. Add more reviewed entries to make answers more useful."},
  {title:"Privacy and storage",category:"Privacy",color:"pink",body:"Conversation memory can be stored in this browser using localStorage. It is not a server database, does not sync across devices, and should not be used for secrets or sensitive information."},
  {title:"What is not implemented yet?",category:"Roadmap",color:"gold",body:"This starter does not yet include user accounts, secure server-side database, file uploads, document indexing, model training, or a general-purpose neural language model. These require separate engineering and testing."},
  {title:"How to improve Tamanna",category:"Roadmap",color:"orange",body:"Grow the curated knowledge base, add a local retrieval index, build a safe backend and database, add tests, and later integrate an open-weight model running on hardware you control. No Gemini or GPT is required for that path."},
  {title:"Project capabilities",category:"Features",color:"blue",body:"The current website includes a responsive chat screen, sample prompts, local knowledge search, browser memory, files placeholder, activity overview, settings, dark and light appearance, and a seven-color identity."}
];

const $ = (selector) => document.querySelector(selector);
const messagesEl = $("#messages");
const input = $("#messageInput");
const views = ["chat","knowledge","memory","files","activity","settings"];
let history = [];
const uploadedDocs = [];
let saveMemory = localStorage.getItem("tamanna-save-memory") !== "false";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2300);
}
function renderMessage(role, text, persist=true) {
  const article = document.createElement("article");
  article.className = "message " + role;
  article.innerHTML = '<div class="message-avatar">'+(role === "assistant" ? "✦" : "T")+'</div><div class="bubble"></div>';
  article.querySelector(".bubble").textContent = text;
  messagesEl.appendChild(article);
  if (persist && saveMemory) {
    history.push({role,text,at:new Date().toISOString()});
    localStorage.setItem("tamanna-chat-history", JSON.stringify(history.slice(-80)));
    updateMemory();
  }
  messagesEl.scrollIntoView({behavior:"smooth",block:"end"});
}
function words(text) {
  return String(text).toLowerCase().match(/[a-z0-9]+|[\u0980-\u09ff]+/g) || [];
}
function answerQuestion(question) {
  const query = words(question);
  const ranked = [...knowledge, ...uploadedDocs].map(item => {
    const haystack = words(item.title+" "+item.category+" "+item.body);
    const unique = new Set(haystack);
    const score = query.reduce((sum, word) => sum + (unique.has(word) ? (item.title.toLowerCase().includes(word) ? 3 : 1) : 0), 0);
    return {item,score};
  }).sort((a,b)=>b.score-a.score);
  const best = ranked[0];
  if (best && best.score >= 1) return best.item.body + "\n\nSource: local knowledge — "+best.item.title+".";
  if (/hello|hi|hey|হ্যালো|সালাম|আসসালামু/i.test(question)) return "Hello! I'm Tamanna. I’m running in local demo mode. Ask me about this workspace, local knowledge, privacy, or the project roadmap.";
  if (/thank|ধন্যবাদ/i.test(question)) return "You're welcome! I’m here to help you explore the Tamanna workspace.";
  return "I couldn't find a reliable match in my local knowledge yet. This demo does not invent an answer or contact Gemini/GPT. Add a reviewed entry to the knowledge base, or ask about Tamanna, local mode, privacy, features, or the roadmap.";
}
function sendMessage(text) {
  const clean = text.trim(); if (!clean) return;
  $("#suggestions").style.display = "none";
  renderMessage("user",clean);
  input.value = "";
  window.setTimeout(()=>renderMessage("assistant",answerQuestion(clean)),180);
}
function navigate(view) {
  views.forEach(name => $("#"+name+"View").classList.toggle("active-view",name===view));
  document.querySelectorAll(".nav-item").forEach(button=>button.classList.toggle("active",button.dataset.view===view));
  $("#pageName").textContent = ({chat:"AI Chat",knowledge:"Knowledge base",memory:"Memory",files:"Your files",activity:"Activity",settings:"Settings"})[view];
  $("#sidebar").classList.remove("open");
  if(view==="knowledge") renderKnowledge();
  if(view==="memory") updateMemory();
}
function renderKnowledge() {
  $("#knowledgeCount").textContent = (knowledge.length+uploadedDocs.length)+" entries";
  $("#knowledgeGrid").innerHTML = [...knowledge,...uploadedDocs].map(item=>'<article class="knowledge-card"><div class="knowledge-symbol">✧</div><div><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.body)+'</p></div></article>').join("");
}
function updateMemory() {
  $("#memoryCount").textContent = history.length+" messages";
  const list = $("#memoryList");
  if (!history.length) { list.innerHTML='<p class="empty-state">No saved conversations yet. Start chatting to build local history.</p>'; return; }
  list.innerHTML = history.slice().reverse().slice(0,12).map(item=>'<div class="memory-item">'+escapeHtml(item.text)+'<small>'+escapeHtml(item.role)+' · '+new Date(item.at).toLocaleString()+'</small></div>').join("");
}

function renderFiles() {
  const list = $("#fileList");
  if (!uploadedDocs.length) { list.innerHTML='<p class="empty-state">No documents imported in this session.</p>'; return; }
  list.innerHTML = uploadedDocs.map((doc,index)=>'<div class="file-row"><span class="file-badge">▤</span><div><strong>'+escapeHtml(doc.title)+'</strong><small>'+doc.size+' · Available in local chat search</small></div><button class="subtle-button" data-remove-file="'+index+'" type="button">Remove</button></div>').join("");
  list.querySelectorAll("[data-remove-file]").forEach(button=>button.addEventListener("click",()=>{
    uploadedDocs.splice(Number(button.dataset.removeFile),1); renderFiles(); renderKnowledge();
    showToast("Document removed from this session");
  }));
}
$("#fileInput").addEventListener("change", async event => {
  const files = Array.from(event.target.files || []);
  for (const file of files) {
    const extension = file.name.split(".").pop().toLowerCase();
    if (!["txt","md","json","csv"].includes(extension)) { showToast("Unsupported file type: "+file.name); continue; }
    if (file.size > 2 * 1024 * 1024) { showToast("File is larger than 2 MB: "+file.name); continue; }
    try {
      const body = await file.text();
      if (!body.trim()) { showToast("Skipped empty file: "+file.name); continue; }
      const title = file.name.replace(/\.[^.]+$/, "");
      const existing = uploadedDocs.findIndex(doc=>doc.title===title);
      const entry = {title,category:"Uploaded document",color:"blue",body,size:(file.size/1024).toFixed(1)+" KB"};
      if(existing>=0) uploadedDocs[existing]=entry; else uploadedDocs.push(entry);
    } catch { showToast("Could not read: "+file.name); }
  }
  event.target.value="";
  renderFiles(); renderKnowledge();
  if(uploadedDocs.length) showToast("Local documents ready for chat search");
});

function loadHistory() {
  try { history = saveMemory ? JSON.parse(localStorage.getItem("tamanna-chat-history") || "[]") : []; if(!Array.isArray(history)) history=[]; }
  catch { history=[]; }
  history.slice(-16).forEach(item=>renderMessage(item.role,item.text,false));
  updateMemory();
}
$("#chatForm").addEventListener("submit",event=>{event.preventDefault();sendMessage(input.value);});
input.addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();$("#chatForm").requestSubmit();}});
document.querySelectorAll("[data-prompt]").forEach(button=>button.addEventListener("click",()=>sendMessage(button.dataset.prompt)));
document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.view)));
$("#newChat").addEventListener("click",()=>{messagesEl.innerHTML="";$("#suggestions").style.display="grid";navigate("chat");showToast("New conversation started");});
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
function toggleTheme(){document.body.classList.toggle("light");localStorage.setItem("tamanna-theme",document.body.classList.contains("light")?"light":"dark");}
$("#themeToggle").addEventListener("click",toggleTheme);
$("#settingsTheme").addEventListener("click",toggleTheme);
if(localStorage.getItem("tamanna-theme")==="light")document.body.classList.add("light");
$("#memorySetting").checked=saveMemory;
$("#memorySetting").addEventListener("change",event=>{
  saveMemory=event.target.checked;localStorage.setItem("tamanna-save-memory",String(saveMemory));
  if(!saveMemory){history=[];localStorage.removeItem("tamanna-chat-history");messagesEl.innerHTML="";updateMemory();}
  showToast(saveMemory?"Local memory enabled":"Local memory disabled and cleared");
});
$("#clearMemory").addEventListener("click",()=>{history=[];localStorage.removeItem("tamanna-chat-history");messagesEl.innerHTML="";updateMemory();showToast("Local memory cleared");});
const dialog=$("#aboutDialog");
$("#aboutButton").addEventListener("click",()=>dialog.showModal());
$("#closeDialog").addEventListener("click",()=>dialog.close());
$("#dialogOk").addEventListener("click",()=>dialog.close());
loadHistory();
renderKnowledge();
