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
  await page.getByLabel("Workspace name").fill("SignalDesk E2E Studio");
  await page.getByRole("button", { name: "Open the Control Room" }).click();

  await page.waitForURL("**/control-room");
  await expectAccessible(page, "control room");
  await page.goto("/signals/new");
  await expectAccessible(page, "new Signal form");
  await page.getByLabel("Signal title").fill("Decision history disappears after refresh");
  await page.getByLabel("Evidence and context").fill("The product team loses the reasoning attached to a priority after refreshing the workspace.");
  await page.getByRole("button", { name: "Publish to Signal Feed" }).click();

  await page.waitForURL("**/signal-feed?created=1");
  await expect(page.getByText("Decision history disappears after refresh", { exact: true })).toBeVisible();
  await expectAccessible(page, "Signal Feed");
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
