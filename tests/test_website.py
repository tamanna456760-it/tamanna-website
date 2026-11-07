import pathlib
import re
import unittest
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]

class WebsiteHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.assets = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.assets.append(attrs.get("href"))
        if tag == "script" and attrs.get("src"):
            self.assets.append(attrs["src"])

class WebsiteTests(unittest.TestCase):
    def test_required_website_files_exist(self):
        for name in ("index.html", "styles.css", "app.js", "README.md"):
            with self.subTest(name=name):
                self.assertTrue((ROOT / name).is_file())
                self.assertGreater((ROOT / name).stat().st_size, 0)

    def test_html_references_local_assets(self):
        parser = WebsiteHTMLParser()
        parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
        self.assertIn("styles.css", parser.assets)
        self.assertIn("app.js", parser.assets)
        for asset in parser.assets:
            self.assertTrue((ROOT / asset).is_file(), asset)

    def test_required_ui_targets_exist(self):
        parser = WebsiteHTMLParser()
        parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
        for element_id in ("chatView", "knowledgeView", "memoryView", "filesView",
                           "activityView", "settingsView", "chatForm", "messageInput",
                           "themeToggle", "memorySetting"):
            with self.subTest(element_id=element_id):
                self.assertIn(element_id, parser.ids)

    def test_css_is_complete_and_has_seven_palette_colors(self):
        css = (ROOT / "styles.css").read_text(encoding="utf-8")
        self.assertFalse(css.startswith("500;600;700"))
        self.assertEqual(css.count("{"), css.count("}"), "Unbalanced CSS braces")
        self.assertIn(".color-dots i:nth-child(7)", css)
        for token in ("--violet:", "--blue:", "--cyan:", "--green:",
                      "--gold:", "--pink:", "--orange:"):
            self.assertIn(token, css)

    def test_no_cloud_ai_api_in_demo(self):
        js = (ROOT / "app.js").read_text(encoding="utf-8").lower()
        html = (ROOT / "index.html").read_text(encoding="utf-8").lower()
        for forbidden in ("generativelanguage.googleapis.com", "api.openai.com"):
            self.assertNotIn(forbidden, js + html)

    def test_local_knowledge_has_entries(self):
        js = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertGreaterEqual(js.count('{title:"'), 5)
        self.assertIn("function answerQuestion", js)

if __name__ == "__main__":
    unittest.main(verbosity=2)
