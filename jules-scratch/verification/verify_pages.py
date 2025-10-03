from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Verify api-test.html
    page.goto("http://localhost:5173/api-test.html")
    page.screenshot(path="jules-scratch/verification/api-test-page.png")

    # Verify agent page
    page.goto("http://localhost:5173/agent")
    page.screenshot(path="jules-scratch/verification/agent-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)