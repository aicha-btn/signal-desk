import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { createLocalAccount, removeLocalAccount } from "./support/local-account";

let account: Awaited<ReturnType<typeof createLocalAccount>> | undefined;

test.beforeAll(async () => {
  account = await createLocalAccount();
});

test.afterAll(async () => {
  await removeLocalAccount(account);
});

test("an operator creates a workspace and publishes its first Signal", async ({ page }) => {
  if (!account) throw new Error("The E2E account was not provisioned.");

  await page.goto("/login");
  await expectAccessible(page, "login");
  await page.getByLabel("Work email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Enter the Control Room" }).click();

  await page.waitForURL("**/onboarding");
  await expect(page.getByRole("heading", { name: "One name. One boundary. Clear ownership." })).toBeVisible();
  await expectAccessible(page, "onboarding");
  await page.getByLabel("Workspace name").fill("SignalDesk E2E Studio");
  await page.getByRole("button", { name: "Open the Control Room" }).click();

  await page.waitForURL("**/control-room");
  await expectAccessible(page, "control room");
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileNavigation = page.getByRole("navigation", { name: "Mobile workspace navigation" });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Signal Feed" })).toContainText("Signals");
  const mobileNavigationBox = await mobileNavigation.boundingBox();
  expect(mobileNavigationBox, "mobile workspace navigation must be rendered").not.toBeNull();
  expect(mobileNavigationBox!.y, "mobile workspace navigation must stay at the bottom edge").toBeGreaterThanOrEqual(760);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/signals/new");
  await expectAccessible(page, "new Signal form");
  await page.getByLabel("Signal title").fill("Decision history disappears after refresh");
  await page.getByLabel("Evidence and context").fill("The product team loses the reasoning attached to a priority after refreshing the workspace.");
  await page.getByRole("button", { name: "Publish to Signal Feed" }).click();

  await page.waitForURL("**/signal-feed?created=1");
  await expect(page.getByText("Decision history disappears after refresh", { exact: true })).toBeVisible();
  await expectAccessible(page, "Signal Feed");
  await page.goto("/members");
  await expectAccessible(page, "members");
  await page.goto("/settings");
  await expectAccessible(page, "settings");

  await page.goto("/customers");
  await expectAccessible(page, "customers");
  await page.getByRole("link", { name: "Add customer" }).click();
  await page.getByLabel("Customer name").fill("Portfolio Contact");
  await page.getByLabel("Company").fill("Northstar Demo");
  await page.getByLabel("Email (optional)").fill("portfolio-contact@example.test");
  await page.getByRole("button", { name: "Create customer" }).click();
  await page.waitForURL("**/customers?created=1");
  await expect(page.getByText("Portfolio Contact", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Edit Portfolio Contact" }).click();
  await expectAccessible(page, "edit customer");
  await page.getByLabel("Customer name").fill("Portfolio Contact Updated");
  await page.getByRole("button", { name: "Save customer" }).click();
  await page.waitForURL("**/customers?updated=1");
  await expect(page.getByText("Portfolio Contact Updated", { exact: true })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Portfolio Contact Updated" }).click();
  await page.waitForURL("**/customers?deleted=1");
  await expect(page.getByText("Portfolio Contact Updated", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Attached Signals were kept");
});

async function expectAccessible(page: Page, context: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target.join(" ")),
  }));

  expect(summary, `${context} must have no WCAG 2.2 A/AA violations`).toEqual([]);
}
