import { expect, test } from "@playwright/test";

test("archive lists posts and opens one", async ({ page }) => {
    await page.goto("/post");

    await expect(
        page.getByRole("heading", { name: "All articles" }),
    ).toBeVisible();
    await expect(page.getByTestId("database-unavailable")).toHaveCount(0);

    const articleLinks = page.locator('a[href^="/post/"]');
    await expect(articleLinks.first()).toBeVisible();

    await articleLinks.first().click();

    await expect(page).toHaveURL(/\/post\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByTestId("database-unavailable")).toHaveCount(0);
});

test("posts API returns published posts", async ({ request }) => {
    const response = await request.get("/api/posts?limit=3");

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body.posts)).toBeTruthy();
    expect(body.posts.length).toBeGreaterThan(0);
    expect(body.posts[0]).toHaveProperty("title");
});
