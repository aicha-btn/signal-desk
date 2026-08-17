import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import {
  createLocalPublicWorkspace,
  removeLocalPublicWorkspace,
  type LocalPublicWorkspace,
} from "./support/local-account";

let workspace: LocalPublicWorkspace | undefined;

test.beforeAll(() => {
  workspace = createLocalPublicWorkspace();
});

test.afterAll(() => {
  removeLocalPublicWorkspace(workspace);
});

test("public pages reflow across the design-system viewports", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 720, height: 900 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
    { width: 1728, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expectNoHorizontalOverflow(page, `landing at ${viewport.width}px`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/forms/${workspace?.slug}`);
  await expectNoHorizontalOverflow(page, "public Signal form at 390px");
  await expectAccessible(page, "public Signal form");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/login?mode=signup");
  await expectAccessible(page, "signup");
  await page.goto("/invitations/accessibility-check");
  await expectAccessible(page, "invitation entry");
});

test("skip links and custom selects preserve a logical keyboard flow", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#top")).toBeFocused();

  const roleSelect = page.getByRole("combobox", { name: "role" });
  await roleSelect.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("option", { name: "Choose", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Product" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(roleSelect).toBeFocused();

  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "team Size" })).toBeFocused();
  await expect(page.getByRole("listbox", { name: "role options" })).toBeHidden();
});

test("reduced-motion and public error recovery stay explicit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.locator(".hero-color-plane-cobalt").evaluate((element) => {
    const style = getComputedStyle(element);
    return { durationSeconds: Number.parseFloat(style.animationDuration), iterations: style.animationIterationCount };
  });
  expect(motion.iterations).toBe("1");
  expect(motion.durationSeconds).toBeLessThanOrEqual(0.00001);

  await page.goto(`/forms/${workspace?.slug}`);
  await page.getByLabel("What happened? *").fill("no");
  await page.getByLabel("Give us the useful context. *").fill("too short");
  await page.getByRole("button", { name: "Send the Signal" }).click();
  const title = page.getByLabel("What happened? *");
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert").filter({ hasText: "Check the highlighted fields." })).toBeVisible();
});

async function expectAccessible(page: Page, context: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations, `${context} must have no WCAG 2.2 A/AA violations`).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page, context: string) {
  const dimensions = await page.locator("html").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(dimensions.scrollWidth, `${context} must not overflow horizontally`).toBeLessThanOrEqual(dimensions.clientWidth);
}
