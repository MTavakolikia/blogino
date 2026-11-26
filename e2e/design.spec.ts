import { expect, test, type Page } from "@playwright/test";

const VIEWPORTS = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
];

async function expectNoHorizontalOverflow(page: Page) {
    const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
    }));
    expect(
        overflow.scrollWidth,
        `page overflows horizontally (${overflow.scrollWidth} > ${overflow.clientWidth})`,
    ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

async function getPostId(page: Page) {
    const response = await page.request.get("/api/posts?limit=1");
    const body = await response.json();
    return body.posts[0].id as string;
}

test.describe("post cards", () => {
    test("cards expose category, reading time, author and likes", async ({
        page,
    }) => {
        await page.goto("/");
        const card = page.locator("article").first();
        await expect(card).toBeVisible();

        // Reading-time badge.
        await expect(card.getByText(/\d+\s*min/)).toBeVisible();
        // Author byline is present.
        await expect(card.locator("p").first()).not.toBeEmpty();
        // Like count pill.
        await expect(card.locator("span").filter({ hasText: /^\d+$/ }).first()).toBeVisible();
    });

    test("the first home card is a featured, double-width card", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/");

        const cards = page.locator("article");
        await expect(cards.first()).toBeVisible();

        const featured = await cards.nth(0).boundingBox();
        const regular = await cards.nth(1).boundingBox();

        expect(featured).not.toBeNull();
        expect(regular).not.toBeNull();
        expect(featured!.width).toBeGreaterThan(regular!.width * 1.5);
    });

    test("cards lift and gain a shadow on hover", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/");

        const card = page.locator("article").nth(1);
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible();

        const before = await card.evaluate((el) => getComputedStyle(el).boxShadow);
        await card.hover();
        await page.waitForTimeout(450);
        const after = await card.evaluate((el) => getComputedStyle(el).boxShadow);

        expect(after).not.toBe(before);
    });
});

test.describe("skeletons", () => {
    test("archive grid shows a layout-matched skeleton while filtering", async ({
        page,
    }) => {
        await page.goto("/post");
        await expect(page.locator("article").first()).toBeVisible();

        // Slow the data request so the loading state is observable.
        await page.route("**/api/posts?**", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 900));
            await route.continue();
        });

        await page
            .getByRole("button", { name: /^Programming/ })
            .first()
            .click();

        const skeleton = page.getByTestId("posts-grid-skeleton");
        await expect(skeleton).toBeVisible();
        await expect(page.getByTestId("post-card-skeleton").first()).toBeVisible();

        await expect(skeleton).toHaveCount(0, { timeout: 15_000 });
        await expect(page.locator("article").first()).toBeVisible();
    });

    test("skeleton placeholders use the shimmer animation", async ({ page }) => {
        await page.goto("/post");
        await expect(page.locator("article").first()).toBeVisible();

        await page.route("**/api/posts?**", async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 900));
            await route.continue();
        });

        await page
            .getByRole("button", { name: /^Programming/ })
            .first()
            .click();

        const placeholder = page
            .getByTestId("post-card-skeleton")
            .first()
            .getByTestId("skeleton")
            .first();
        await expect(placeholder).toBeVisible();

        const animation = await placeholder.evaluate(
            (el) => getComputedStyle(el, "::before").animationName,
        );
        expect(animation).toContain("skeleton-shimmer");
    });
});

test.describe("archive", () => {
    test("sidebar dates render in English, not the system calendar", async ({
        page,
    }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/post");

        const sidebar = page.locator("aside").first();
        await expect(sidebar).toBeVisible();

        const dates = sidebar.locator("p.text-xs");
        await expect(dates.first()).toBeVisible();

        const texts = await dates.allInnerTexts();
        const englishDate = /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/;
        expect(texts.length).toBeGreaterThan(0);
        for (const text of texts) {
            expect(text.trim()).toMatch(englishDate);
        }
    });

    test("pagination renders numbered pages and navigates", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/post");

        const pagination = page.getByRole("navigation", { name: "Pagination" });
        await expect(pagination).toBeVisible();

        const current = pagination.locator('[aria-current="page"]');
        await expect(current).toHaveText("1");

        await pagination.getByRole("button", { name: "Page 2" }).click();
        await expect(pagination.locator('[aria-current="page"]')).toHaveText("2");
    });
});

test.describe("responsive layout", () => {
    for (const viewport of VIEWPORTS) {
        test(`no horizontal overflow on every section (${viewport.name})`, async ({
            page,
        }) => {
            await page.setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });

            const postId = await getPostId(page);
            const routes = [
                "/",
                "/post",
                `/post/${postId}`,
                "/about-me",
                "/contact-me",
            ];

            for (const route of routes) {
                await page.goto(route);
                await expectNoHorizontalOverflow(page);
            }
        });
    }
});
