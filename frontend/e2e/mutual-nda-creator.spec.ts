import { expect, test } from "@playwright/test";

test("creates a draft, blocks incomplete exports, and downloads all formats", async ({ page }) => {
  page.on("pageerror", (error) => console.log(`PAGE_ERROR: ${error.message}`));
  page.on("console", (message) => console.log(`BROWSER_CONSOLE: ${message.text()}`));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Mutual NDA Creator" })).toBeVisible();
  await page.locator("#purpose").fill("");
  await expect(page.locator("#purpose")).toHaveValue("");
  await page.getByRole("button", { name: "Markdown" }).click();
  await expect(page.getByText("Complete the highlighted fields before downloading.")).toBeVisible();
  await page.locator("#purpose").fill("Evaluating whether to enter into a business relationship with the other party.");
  await page.locator("#party1-name").fill("Ada Lovelace");
  await page.locator("#party1-title").fill("Director");
  await page.locator("#party1-company").fill("Analytical Engines");
  await page.locator("#party1-address").fill("ada@example.com");
  await page.locator("#party2-name").fill("Grace Hopper");
  await page.locator("#party2-title").fill("Founder");
  await page.locator("#party2-company").fill("Compilers Inc");
  await page.locator("#party2-address").fill("grace@example.com");
  await expect(page.getByRole("heading", { name: "Analytical Engines ↔ Compilers Inc" })).toBeVisible();
  const markdown = page.waitForEvent("download"); await page.getByRole("button", { name: "Markdown" }).click(); await (await markdown).saveAs(".qa-artifacts/mutual-nda.md");
  const docx = page.waitForEvent("download"); await page.getByRole("button", { name: "Download DOCX" }).click(); await (await docx).saveAs(".qa-artifacts/mutual-nda.docx");
  const pdf = page.waitForEvent("download"); await page.getByRole("button", { name: "Download PDF" }).click(); await (await pdf).saveAs(".qa-artifacts/mutual-nda.pdf");
});
