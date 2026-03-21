import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

def render_page(page_path: Path, output: Path):
    url = f"file://{page_path.resolve()}"
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        page.set_viewport_size({"width": 1080, "height": 1920})
        page.wait_for_timeout(1500)
        page.screenshot(path=output, full_page=True)
        browser.close()

if __name__ == "__main__":
    page_path = Path('browser-ui/idle.html')
    output = Path('logs/idle_preview.png')
    render_page(page_path, output)
    print(f"Preview saved to {output.resolve()}")
