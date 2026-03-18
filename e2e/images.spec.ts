import { expect, test } from "@playwright/test";

test("images are rendered in the production build", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await expect(page.locator("h1")).toBeVisible();

  // Check all img elements have loaded (naturalWidth > 0 means the image loaded)
  const images = page.locator("img");
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await expect(img).toBeVisible();
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(
      naturalWidth,
      `img[${i}] (${await img.getAttribute("src")}) should have loaded`,
    ).toBeGreaterThan(0);
  }
});

test("picture elements have source variants", async ({ page }) => {
  await page.goto("/");

  const pictures = page.locator("picture");
  const count = await pictures.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const sources = pictures.nth(i).locator("source");
    const sourceCount = await sources.count();
    expect(sourceCount, `picture[${i}] should have source elements`).toBeGreaterThan(0);

    // Verify source srcset attributes reference actual files (not virtual IDs)
    for (let j = 0; j < sourceCount; j++) {
      const srcset = await sources.nth(j).getAttribute("srcset");
      expect(srcset, `picture[${i}] source[${j}] should have srcset`).toBeTruthy();
      expect(srcset).not.toContain("/@imagepresets/");
    }
  }
});

test("processed image files are served correctly", async ({ page, request }) => {
  await page.goto("/");

  // Collect all image URLs from srcset and src attributes
  const imageUrls = await page.evaluate(() => {
    const urls = new Set<string>();
    for (const source of document.querySelectorAll("source[srcset]")) {
      const srcset = source.getAttribute("srcset")!;
      for (const entry of srcset.split(",")) {
        const url = entry.trim().split(/\s+/)[0];
        if (url) urls.add(url);
      }
    }
    for (const img of document.querySelectorAll("img[src]")) {
      const src = img.getAttribute("src")!;
      if (src && !src.startsWith("data:")) urls.add(src);
    }
    return [...urls];
  });

  expect(imageUrls.length).toBeGreaterThan(0);

  // Verify each processed image URL returns 200
  for (const url of imageUrls) {
    const response = await request.get(url);
    expect(response.status(), `${url} should be served`).toBe(200);
    expect(response.headers()["content-type"]).toMatch(/^image\//);
  }
});
