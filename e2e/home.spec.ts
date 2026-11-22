import { expect, test } from "@playwright/test";

test("home page renders articles from the database", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Read the ideas that",
    );
    await expect(
        page.getByRole("heading", { name: "Latest articles" }),
    ).toBeVisible();
    await expect(page.getByTestId("database-unavailable")).toHaveCount(0);

    const articleLinks = page.locator('a[href^="/post/"]');
    await expect(articleLinks.first()).toBeVisible();
    expect(await articleLinks.count()).toBeGreaterThan(0);
});

test("home page category filter is interactive", async ({ page }) => {
    await page.goto("/");

    const chips = page.locator("button").filter({ hasText: "All" });
    await expect(chips.first()).toBeVisible();

    await chips.first().click();
    await expect(page.locator('a[href^="/post/"]').first()).toBeVisible();
});

test("view all link navigates to the archive", async ({ page }) => {
    await page.goto("/");

    await page
        .getByRole("link", { name: /view all/i })
        .first()
        .click();

    await expect(page).toHaveURL(/\/post$/);
    await expect(
        page.getByRole("heading", { name: "All articles" }),
    ).toBeVisible();
});
