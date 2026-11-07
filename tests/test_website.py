import pathlib
import unittest
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]

class WebsiteHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.assets = []
        self.palette_count = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.assets.append(attrs.get("href"))
        if tag == "script" and attrs.get("src"):
            self.assets.append(attrs.get("src"))
        if tag == "button" and attrs.get("data-palette"):
            self.palette_count += 1

class WebsiteTests(unittest.TestCase):
    def setUp(self):
        self.html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.css = (ROOT / "styles.css").read_text(encoding="utf-8")
        self.js = (ROOT / "app.js").read_text(encoding="utf-8")

    def test_required_website_files_exist(self):
        for name in ("index.html", "styles.css", "app.js", "README.md"):
            with self.subTest(name=name):
                self.assertTrue((ROOT / name).is_file())
                self.assertGreater((ROOT / name).stat().st_size, 0)

    def test_html_references_local_assets(self):
        parser = WebsiteHTMLParser()
        parser.feed(self.html)
        self.assertIn("styles.css", parser.assets)
        self.assertIn("app.js", parser.assets)
        for asset in parser.assets:
            self.assertTrue((ROOT / asset).is_file(), asset)

    def test_all_workspace_views_and_controls_exist(self):
        parser = WebsiteHTMLParser()
        parser.feed(self.html)
        for element_id in (
            "chatView", "historyView", "knowledgeView", "filesView",
            "activityView", "settingsView", "aboutView", "chatForm",
            "messageInput", "historySearch", "knowledgeSearch", "fileInput",
            "memorySetting", "palettePicker", "exportData", "resetData"
        ):
            with self.subTest(element_id=element_id):
                self.assertIn(element_id, parser.ids)

    def test_seven_color_palette_and_responsive_layout(self):
        parser = WebsiteHTMLParser()
        parser.feed(self.html)
        self.assertEqual(parser.palette_count, 7)
        self.assertEqual(self.css.count("{"), self.css.count("}"))
        for token in ("--violet:", "--blue:", "--cyan:", "--green:",
                      "--gold:", "--pink:", "--orange:"):
            self.assertIn(token, self.css)
        self.assertIn("@media(max-width:760px)", self.css)

    def test_no_external_ai_api_is_used(self):
        source = (self.html + self.js).lower()
        for forbidden in ("generativelanguage.googleapis.com", "api.openai.com"):
            self.assertNotIn(forbidden, source)

    def test_local_knowledge_and_document_search_are_implemented(self):
        self.assertIn("function answerQuestion", self.js)
        self.assertIn("function importFiles", self.js)
        self.assertGreaterEqual(self.js.count('{title:"'), 8)
        self.assertIn("localStorage", self.js)

    def test_workspace_has_transparent_model_disclosure(self):
        self.assertIn("not a trained neural language model", self.js.lower())
        self.assertIn("not a trained AI model", self.html.lower())

if __name__ == "__main__":
    unittest.main(verbosity=2)
