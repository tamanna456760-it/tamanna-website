import pathlib
import unittest
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.assets=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get("id"):self.ids.add(a["id"])
  if tag in ("link","script") and (a.get("href") or a.get("src")):self.assets.append(a.get("href") or a.get("src"))
  if tag=="a" and a.get("href"):self.links.append(a["href"])
class WebsiteTests(unittest.TestCase):
 def setUp(self):
  self.html=(ROOT/"index.html").read_text();self.admin=(ROOT/"admin/index.html").read_text();self.parser=Parser();self.parser.feed(self.html)
 def test_chat_panel_is_homepage(self):
  for x in ("chatBox","messageInput","sendButton","authPanel","settingsPanel"):self.assertIn(x,self.parser.ids)
  self.assertFalse(any("admin" in link.lower() for link in self.parser.links))
  self.assertIn("chat-side-rail",self.html)
  self.assertNotIn("Open User Chat",self.admin)
  self.assertNotIn('href="../"',self.admin)
 def test_admin_panel_is_published(self):
  self.assertIn("Admin Dashboard",self.admin);self.assertIn("../js/admin.js",self.admin);self.assertIn("../css/admin.css",self.admin);self.assertIn("runEthicalAudit",self.admin);self.assertIn("antivirusForm",self.admin);self.assertNotIn("Open User Chat",self.admin)
  self.assertIn("PREVIEW MODE",(ROOT/"js/admin.js").read_text());self.assertIn("/api/admin/security/ethical-audit",(ROOT/"js/admin.js").read_text());self.assertIn("/tamanna-ai/security/antivirus/scan-upload",(ROOT/"js/admin.js").read_text());self.assertNotIn('location.href="/"',(ROOT/"js/admin.js").read_text())
 def test_assets_exist(self):
  for x in self.parser.assets:
   if x.startswith(("http:","https:","#")):continue
   self.assertTrue((ROOT/x.split("?",1)[0]).is_file(),x)
  for x in ("css/style.css","css/settings.css","css/auth.css","css/admin.css","js/auth.js","js/chat.js","js/admin.js","js/settings.js","js/memories.js","js/knowledge.js","js/model-health.js","assets/tamanna-ai-official-logo.jpg","manifest.webmanifest"):
   self.assertTrue((ROOT/x).is_file(),x)
 def test_relative_paths(self):
  for p in (self.html,self.admin):
   self.assertNotIn('href="/assets/',p);self.assertNotIn('src="/js/',p);self.assertNotIn('href="/css/',p)
 def test_api_free_local_chat(self):
  js=(ROOT/"js/chat.js").read_text();html=(ROOT/"index.html").read_text();sw=(ROOT/"sw.js").read_text()
  self.assertIn("tamanna.local.chat.v1",js);self.assertIn("assets/tamanna-knowledge.json",js);self.assertIn("localAnswer",js);self.assertIn("finally {",js);self.assertIn("aria-busy",js);self.assertEqual(js.count("loadKnowledge()"),2) # function declaration plus one invocation
  self.assertNotIn("/api/chat",js);self.assertNotIn("fetch(apiUrl",js);self.assertNotIn("tamanna-api-base",html)
  self.assertIn("./assets/tamanna-knowledge.json",sw)
  data=__import__("json").loads((ROOT/"assets/tamanna-knowledge.json").read_text())
  self.assertGreaterEqual(len(data["entries"]),8)
 def test_no_hosted_model_api(self):
  text=(self.html+(ROOT/"js/chat.js").read_text()).lower()
  self.assertNotIn("generativelanguage.googleapis.com",text);self.assertNotIn("api.openai.com",text)
 def test_seven_color_palette(self):
  css=(ROOT/"css/settings.css").read_text()
  for x in ("purple","blue","teal","green","gold","pink","orange"):self.assertIn(x,css)
 def test_restored_session_triggers_chat_history_load(self):
  auth=(ROOT/"js/auth.js").read_text()
  chat=(ROOT/"js/chat.js").read_text()
  self.assertIn("api(\"/me\").then(result => {",auth)
  self.assertIn("new CustomEvent(\"tamanna:authenticated\"",auth)
  self.assertNotIn("addEventListener(\"tamanna:authenticated\",history)",chat)
  self.assertNotIn("api(\"/api/history\")",chat)
 def test_chat_does_not_expose_admin_only_controls_or_requests(self):
  for marker in ("Host Performance Monitor","Loaded Model Resource Manager","Local Model Recovery Assistant","metricCpu","admin/overview"):
   self.assertNotIn(marker,self.html)
  health=(ROOT/"js/model-health.js").read_text()
  for endpoint in ("/tamanna-ai/system/metrics","/tamanna-ai/model/resources","/tamanna-ai/model/recovery"):
   self.assertNotIn(endpoint,health)
 def test_admin_logout_only_reports_success_after_server_confirms(self):
  js=(ROOT/"js/admin.js").read_text();self.assertIn("data.ok!==true",js);self.assertIn("Sign out failed. Your session may still be active.",js);self.assertNotIn("finally{logout.hidden=true",js)
 def test_admin_preview_safe(self):
  js=(ROOT/"js/admin.js").read_text();self.assertIn("/api/admin/overview",js);self.assertIn("setPreview",js);self.assertIn("Access denied",js)
 def test_pwa_shell(self):
  sw=(ROOT/"sw.js").read_text();self.assertIn("tamanna-ai-shell-v8",sw);self.assertIn("./admin/",sw);self.assertNotIn("./app.js",sw)
if __name__=="__main__":unittest.main(verbosity=2)
