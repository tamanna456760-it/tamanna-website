const knowledge = [
 {title:"What is Tamanna AI?",category:"About",body:"Tamanna AI is a local-first workspace for conversations, knowledge and documents. This website combines a responsive chat interface, searchable reference library, browser-based conversation history, document import and personal settings."},
 {title:"Local AI and model status",category:"Transparency",body:"This website does not use Gemini, GPT or any external AI API. Its current response engine performs keyword-based retrieval over a curated local knowledge library and imported text. It is a useful prototype, not a trained neural language model or a general-purpose reasoning engine."},
 {title:"How knowledge search works",category:"Knowledge",body:"Tamanna compares words in your question with the titles and text in its local knowledge entries and imported documents. It ranks matching entries and returns the best result with its source. If no useful match is found, it says so instead of inventing an answer."},
 {title:"Privacy and local storage",category:"Privacy",body:"Conversation history and selected workspace preferences can be saved in this browser using localStorage. They are not synced to a server or encrypted account database. Imported documents are read locally and held in memory for the current page session. Do not enter passwords, API keys or sensitive information."},
 {title:"Supported documents",category:"Documents",body:"You can import plain text TXT, Markdown MD, JSON and CSV files up to 500 KB each, with up to 10 documents per session. The browser reads the text locally. Imported documents are searchable in chat and disappear when the page is refreshed or closed."},
 {title:"Workspace features",category:"Features",body:"Tamanna includes chat, saved conversations, local knowledge search, document import, activity events, theme controls, seven accent colors, dark and light mode, local workspace naming, data export and local data reset."},
 {title:"How to make a project plan",category:"Guides",body:"A useful project plan starts with a clear outcome, a list of deliverables, small tasks, an owner for each task, a realistic deadline, required resources and a way to measure completion. Review progress regularly and adjust the next steps."},
 {title:"How to protect an account",category:"Security",body:"Use a unique long password and a password manager, enable multi-factor authentication, keep recovery options current and never share one-time codes. This static Tamanna demo does not provide online accounts or authentication."},
 {title:"Roadmap and future model",category:"Roadmap",body:"A true independent local AI assistant would need open model weights, a local inference runtime, sufficient RAM and compute, model evaluation and a safe integration layer. Fine-tuning would additionally need a prepared dataset and training resources. This static website does not contain those model weights."},
 {title:"Contact and ownership",category:"About",body:"Tamanna AI website project owner: HM INSAN ALI. The website is a static browser application. For source code and project updates, use the tamanna-website GitHub repository."},
 {title:"Tamanna সম্পর্কে",category:"বাংলা",body:"Tamanna AI একটি local-first workspace। এখানে chat, conversation history, knowledge search, document import, activity এবং settings রয়েছে। এই সংস্করণে Gemini, GPT বা কোনো external AI API ব্যবহার করা হয় না।"},
 {title:"নিজস্ব AI মডেল",category:"বাংলা",body:"এই ওয়েবসাইটে এখনো প্রশিক্ষিত neural AI model নেই। এটি local knowledge-এর keyword matching করে উত্তর খোঁজে। সত্যিকারের নিজস্ব local AI model চালাতে model weights, inference runtime এবং উপযুক্ত hardware প্রয়োজন।"},
 {title:"গোপনীয়তা",category:"বাংলা",body:"Conversation history এই browser-এর localStorage-এ রাখা হয়। Import করা document browser-এর মধ্যেই পড়া হয়, server-এ upload হয় না এবং page refresh করলে session-এর document মুছে যায়। Password বা API key এখানে লিখবেন না।"}
];
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
const STORAGE = {chats:"tamanna-workspace-chats",memory:"tamanna-save-memory",theme:"tamanna-theme",palette:"tamanna-palette",profile:"tamanna-profile",compact:"tamanna-compact"};
const palettes = {
 violet:["#9675ff","150,117,255"],blue:["#5a8cff","90,140,255"],cyan:["#43d7e8","67,215,232"],
 green:["#58d7a0","88,215,160"],gold:["#f1c66d","241,198,109"],pink:["#ed83bb","237,131,187"],orange:["#ff986e","255,152,110"]
};
let chats = [];
let activeChatId = null;
let saveMemory = localStorage.getItem(STORAGE.memory) !== "false";
let documents = [];
let activity = [];
let currentView = "chat";
const viewNames = {chat:"Chat",history:"Conversations",knowledge:"Knowledge base",files:"My documents",activity:"Activity",settings:"Settings",about:"About Tamanna"};

function safeParse(value,fallback){try{return JSON.parse(value)||fallback;}catch{return fallback;}}
function makeId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function toast(message){const node=$("#toast");node.textContent=message;node.classList.add("show");window.setTimeout(()=>node.classList.remove("show"),2300);}
function logActivity(title,detail){activity.unshift({title,detail,at:new Date().toISOString()});activity=activity.slice(0,40);renderActivity();}
function saveChats(){if(!saveMemory)return;try{localStorage.setItem(STORAGE.chats,JSON.stringify(chats.slice(0,60)));}catch{toast("Browser storage is full. Export or clear old conversations.");}}
function activeChat(){return chats.find(chat=>chat.id===activeChatId)||null;}
function newChat(){
 activeChatId=null;$("#messages").innerHTML="";$("#welcome").hidden=false;$("#suggestions").hidden=false;
 $("#messageInput").value="";navigate("chat");$("#messageInput").focus();
}
function openChat(id){
 const chat=chats.find(item=>item.id===id);if(!chat)return;
 activeChatId=id;$("#messages").innerHTML="";$("#welcome").hidden=true;$("#suggestions").hidden=true;
 chat.messages.forEach(item=>renderMessage(item.role,item.text,false));
 navigate("chat");$("#messageInput").focus();updateRecent();
}
function renderMessage(role,text,persist=true){
 const article=document.createElement("article");article.className="message "+role;
 const avatar=document.createElement("div");avatar.className="message-avatar";avatar.textContent=role==="assistant"?"✦":"T";
 const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;
 article.append(avatar,bubble);$("#messages").appendChild(article);
 if(persist){const chat=activeChat();if(chat){chat.messages.push({role,text,at:new Date().toISOString()});chat.updatedAt=new Date().toISOString();if(role==="user"&&chat.title==="New conversation")chat.title=text.slice(0,54)+(text.length>54?"…":"");saveChats();renderHistory();updateRecent();}}
 article.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function words(text){return String(text).toLowerCase().match(/[a-z0-9]+|[\u0980-\u09ff]+/g)||[];}
function answerQuestion(question){
 const query=words(question).filter(word=>word.length>1);
 const ranked=[...knowledge,...documents].map(item=>{
  const hay=words(item.title+" "+item.category+" "+item.body);const unique=new Set(hay);
  const score=query.reduce((sum,word)=>sum+(unique.has(word)?(item.title.toLowerCase().includes(word)?3:1):0),0);
  return {item,score};
 }).sort((a,b)=>b.score-a.score);
 const best=ranked[0];
 if(best&&best.score>=1)return best.item.body+"\n\nSource: "+best.item.title+" · local library";
 if(/^(hi|hello|hey|হ্যালো|সালাম|আসসালামু)/i.test(question.trim()))return "Hello! I'm Tamanna. I’m running in private local demo mode. I can search the built-in guides and documents you import. What would you like to explore?";
 if(/thank|ধন্যবাদ/i.test(question))return "You're welcome! I’m here to help you explore your local Tamanna workspace.";
 if(/help|কি করতে পার|what can|features|সাহায্য/i.test(question))return "You can use Tamanna to:\n• Search the built-in knowledge library\n• Import TXT, Markdown, JSON and CSV documents\n• Keep conversations in this browser\n• Review workspace activity\n• Customize themes, colors and your workspace name\n\nNote: this demo uses local keyword retrieval, not a trained AI model.";
 return "I couldn't find a reliable match in your local library. I won't invent an answer or contact an external AI service. Try a more specific question, add a document in My documents, or expand your Knowledge base.";
}
function sendMessage(value){
 const text=value.trim();if(!text)return;
 if(!activeChatId){const chat={id:makeId(),title:"New conversation",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),messages:[]};chats.unshift(chat);activeChatId=chat.id;$("#welcome").hidden=true;$("#suggestions").hidden=true;}
 renderMessage("user",text);$("#messageInput").value="";
 const reply=answerQuestion(text);window.setTimeout(()=>renderMessage("assistant",reply),130);
 logActivity("Message searched","Local knowledge retrieval completed");
}
function navigate(view){
 if(!viewNames[view])return;currentView=view;
 Object.keys(viewNames).forEach(name=>$("#"+name+"View").classList.toggle("active-view",name===view));
 $$(".nav-item").forEach(button=>button.classList.toggle("active",button.dataset.view===view));
 $("#pageName").textContent=viewNames[view];$("#sidebar").classList.remove("open");
 if(view==="history")renderHistory();if(view==="knowledge")renderKnowledge();if(view==="files")renderFiles();if(view==="activity")renderActivity();
}
function updateRecent(){
 const target=$("#recentChats");const recent=chats.slice(0,5);
 target.innerHTML=recent.length?recent.map(chat=>'<button class="recent-chat" data-chat-id="'+escapeHtml(chat.id)+'" title="'+escapeHtml(chat.title)+'">'+escapeHtml(chat.title)+'</button>').join(""):'<p class="recent-empty">Your conversations will appear here.</p>';
 target.querySelectorAll("[data-chat-id]").forEach(button=>button.addEventListener("click",()=>openChat(button.dataset.chatId)));
 $("#statChats").textContent=chats.length;
}
function renderHistory(){
 const query=($("#historySearch")?.value||"").toLowerCase();
 const list=chats.filter(chat=>(chat.title+" "+chat.messages.map(m=>m.text).join(" ")).toLowerCase().includes(query));
 $("#historyCount").textContent=chats.length+" chats";
 $("#historyGrid").innerHTML=list.length?list.map(chat=>'<article class="history-card" data-open-chat="'+escapeHtml(chat.id)+'"><strong>'+escapeHtml(chat.title)+'</strong><p>'+escapeHtml(chat.messages.at(-1)?.text||"Empty conversation")+'</p><small>'+chat.messages.length+' messages · '+new Date(chat.updatedAt).toLocaleString()+'</small></article>').join(""):'<div class="panel empty-state">No conversations found. Start a new chat to begin.</div>';
 $$("#historyGrid [data-open-chat]").forEach(card=>card.addEventListener("click",()=>openChat(card.dataset.openChat)));
}
function renderKnowledge(){
 const query=($("#knowledgeSearch")?.value||"").toLowerCase();
 const items=[...knowledge,...documents].filter(item=>(item.title+" "+item.category+" "+item.body).toLowerCase().includes(query));
 $("#knowledgeCount").textContent=(knowledge.length+documents.length)+" entries";
 $("#statKnowledge").textContent=knowledge.length+documents.length;
 $("#knowledgeGrid").innerHTML=items.length?items.map(item=>'<article class="knowledge-card"><div class="knowledge-symbol">✧</div><div><h3>'+escapeHtml(item.title)+'</h3><p>'+escapeHtml(item.body)+'</p><div class="knowledge-meta">'+escapeHtml(item.category||"Document")+'</div></div></article>').join(""):'<div class="panel empty-state">No matching knowledge found.</div>';
}
function renderFiles(){
 $("#fileSummary").textContent=documents.length?documents.length+" documents available in this session":"No documents added yet";
 $("#statFiles").textContent=documents.length;
 $("#fileList").innerHTML=documents.length?documents.map((doc,index)=>'<div class="file-row"><span class="file-badge">▤</span><div><strong>'+escapeHtml(doc.title)+'</strong><small>'+escapeHtml(doc.size)+' · searchable in local chat</small></div><button class="subtle-button" data-remove-doc="'+index+'">Remove</button></div>').join(""):'<p class="empty-state">No documents imported. Add a document to make its contents searchable.</p>';
 $$("#fileList [data-remove-doc]").forEach(button=>button.addEventListener("click",()=>{documents.splice(Number(button.dataset.removeDoc),1);renderFiles();renderKnowledge();toast("Document removed from this session");logActivity("Document removed","A local document was removed");}));
}
async function importFiles(fileList){
 for(const file of Array.from(fileList||[])){
  const ext=file.name.split(".").pop().toLowerCase();
  if(!["txt","md","json","csv"].includes(ext)){toast("Unsupported file type: "+file.name);continue;}
  if(file.size>500*1024){toast("File is larger than 500 KB: "+file.name);continue;}
  if(documents.length>=10){toast("Maximum 10 documents per session");break;}
  try{
   const body=await file.text();if(!body.trim()){toast("Skipped empty file: "+file.name);continue;}
   const title=file.name.replace(/\.[^.]+$/,"");
   const existing=documents.findIndex(doc=>doc.title===title);
   const item={title,category:"Imported document",body,size:(file.size/1024).toFixed(1)+" KB"};
   if(existing>=0)documents[existing]=item;else documents.push(item);
   logActivity("Document imported",file.name+" is available for local search");
  }catch{toast("Could not read "+file.name);}
 }
 renderFiles();renderKnowledge();toast(documents.length+" local document(s) ready");
}
function renderActivity(){
 const rows=activity.length?activity:[{title:"Workspace opened",detail:"Tamanna loaded in this browser",at:new Date().toISOString()},{title:"Local knowledge ready",detail:"Built-in reference library is available",at:new Date().toISOString()}];
 $("#activityList").innerHTML=rows.map(item=>'<div class="event-row"><i class="event-dot"></i><div><strong>'+escapeHtml(item.title)+'</strong><small>'+escapeHtml(item.detail)+'</small></div><time>'+new Date(item.at).toLocaleTimeString()+'</time></div>').join("");
}
function applyTheme(mode){document.body.classList.toggle("light",mode==="light");localStorage.setItem(STORAGE.theme,mode);$$("[data-mode]").forEach(button=>button.classList.toggle("selected",button.dataset.mode===mode));}
function applyPalette(name){const palette=palettes[name]||palettes.violet;document.documentElement.style.setProperty("--accent",palette[0]);document.documentElement.style.setProperty("--accent-rgb",palette[1]);localStorage.setItem(STORAGE.palette,name);$$("[data-palette]").forEach(button=>button.classList.toggle("selected",button.dataset.palette===name));}
function applyProfile(name){const clean=name.trim()||"My workspace";$("#profileName").textContent=clean;$("#profileAvatar").textContent=clean.charAt(0).toUpperCase();$("#displayNameInput").value=clean;localStorage.setItem(STORAGE.profile,clean);}
function exportData(){
 const payload={product:"Tamanna AI",exportedAt:new Date().toISOString(),conversations:chats,preferences:{theme:localStorage.getItem(STORAGE.theme)||"dark",palette:localStorage.getItem(STORAGE.palette)||"violet",profile:localStorage.getItem(STORAGE.profile)||"My workspace"}};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="tamanna-workspace-export.json";link.click();URL.revokeObjectURL(url);toast("Workspace export prepared");
}
function resetData(){
 if(!window.confirm("Reset all saved Tamanna workspace data in this browser? This cannot be undone."))return;
 Object.values(STORAGE).forEach(key=>localStorage.removeItem(key));chats=[];documents=[];activeChatId=null;saveMemory=true;applyTheme("dark");applyPalette("violet");applyProfile("My workspace");$("#memorySetting").checked=true;$("#compactSetting").checked=false;document.body.classList.remove("compact");newChat();renderHistory();renderFiles();renderKnowledge();updateRecent();toast("Local workspace data reset");logActivity("Workspace reset","Saved local workspace data was cleared");
}
function init(){
 chats=safeParse(localStorage.getItem(STORAGE.chats)||"[]",[]);if(!Array.isArray(chats))chats=[];
 const theme=localStorage.getItem(STORAGE.theme)||"dark";const palette=localStorage.getItem(STORAGE.palette)||"violet";
 applyTheme(theme);applyPalette(palette);applyProfile(localStorage.getItem(STORAGE.profile)||"My workspace");
 $("#memorySetting").checked=saveMemory;$("#compactSetting").checked=localStorage.getItem(STORAGE.compact)==="true";document.body.classList.toggle("compact",$("#compactSetting").checked);
 updateRecent();renderHistory();renderKnowledge();renderFiles();renderActivity();
 const last=chats[0];if(last)openChat(last.id);
 logActivity("Tamanna workspace loaded","Local interface initialized; no remote AI service called");
}
$("#chatForm").addEventListener("submit",event=>{event.preventDefault();sendMessage($("#messageInput").value);});
$("#messageInput").addEventListener("keydown",event=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();$("#chatForm").requestSubmit();}});
$$("[data-prompt]").forEach(button=>button.addEventListener("click",()=>sendMessage(button.dataset.prompt)));
$$("[data-view]").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.view)));
$$(".nav-item").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.view)));
$("#newChat").addEventListener("click",newChat);$("#historyNewChat").addEventListener("click",newChat);
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#themeToggle").addEventListener("click",()=>applyTheme(document.body.classList.contains("light")?"dark":"light"));
$$("[data-mode]").forEach(button=>button.addEventListener("click",()=>applyTheme(button.dataset.mode)));
$$("[data-palette]").forEach(button=>{button.style.setProperty("--swatch",palettes[button.dataset.palette][0]);button.addEventListener("click",()=>applyPalette(button.dataset.palette));});
$("#memorySetting").addEventListener("change",event=>{saveMemory=event.target.checked;localStorage.setItem(STORAGE.memory,String(saveMemory));if(!saveMemory){localStorage.removeItem(STORAGE.chats);chats=[];activeChatId=null;$("#messages").innerHTML="";$("#welcome").hidden=false;$("#suggestions").hidden=false;updateRecent();renderHistory();}toast(saveMemory?"Conversation memory enabled":"Conversation memory disabled and saved chats cleared");});
$("#compactSetting").addEventListener("change",event=>{document.body.classList.toggle("compact",event.target.checked);localStorage.setItem(STORAGE.compact,String(event.target.checked));});
$("#saveProfile").addEventListener("click",()=>{applyProfile($("#displayNameInput").value);toast("Workspace name saved");});
$("#profileButton").addEventListener("click",()=>{navigate("settings");$("#displayNameInput").focus();});
$("#exportData").addEventListener("click",exportData);$("#resetData").addEventListener("click",resetData);
$("#clearFiles").addEventListener("click",()=>{if(!documents.length)return;documents=[];renderFiles();renderKnowledge();toast("Imported documents cleared");});
$("#clearActivity").addEventListener("click",()=>{activity=[];renderActivity();});
$("#clearRecent").addEventListener("click",()=>{if(!window.confirm("Clear all saved conversations?"))return;chats=[];activeChatId=null;saveChats();$("#messages").innerHTML="";$("#welcome").hidden=false;$("#suggestions").hidden=false;updateRecent();renderHistory();toast("Conversations cleared");});
$("#historySearch").addEventListener("input",renderHistory);$("#knowledgeSearch").addEventListener("input",renderKnowledge);
$("#fileInput").addEventListener("change",event=>{importFiles(event.target.files);event.target.value="";});
$("#fileInputAlt").addEventListener("change",event=>{importFiles(event.target.files);event.target.value="";});
$("#quickAttach").addEventListener("click",()=>$("#quickFileInput").click());
$("#quickFileInput").addEventListener("change",event=>{importFiles(event.target.files);event.target.value="";});
const dialog=$("#aboutDialog");$("#aboutButton").addEventListener("click",()=>dialog.showModal());$("#closeDialog").addEventListener("click",()=>dialog.close());$("#dialogOk").addEventListener("click",()=>dialog.close());
document.addEventListener("keydown",event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){event.preventDefault();newChat();}});
init();
