import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const rootDirectory = process.cwd();
const baseUrl = process.env.CAPTURE_BASE_URL ?? "http://127.0.0.1:3000";
const email = process.env.DEMO_EMAIL ?? "demo@signaldesk.test";
const password = process.env.DEMO_PASSWORD ?? "SignalDesk-Demo-2026!";
const outputDirectory = path.join(rootDirectory, "docs", "screenshots");

assertLocalUrl(baseUrl);
await assertReachable(baseUrl);
const publicFormSlug = readPublicFormSlug();
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await context.newPage();

try {
  await capture(page, "/", "landing.png", "Stop collecting feedback. Start deciding with it.");
  await capture(page, `/forms/${publicFormSlug}`, "public-form.png", "What should the team hear next?");

  await page.goto(`${baseUrl}/login`);
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Enter the Control Room" }).click();
  await page.waitForURL("**/control-room");

  await capture(page, "/control-room", "control-room.png", "The room is listening.");
  await capture(page, "/signal-feed", "signal-feed.png", "Every Signal, in context.");
  await page.getByText("Export loses selected columns", { exact: true }).click();
  await page.waitForURL("**/signals/**");
  await page.getByRole("heading", { name: "Export loses selected columns" }).waitFor();
  await captureCurrentPage(page, "signal-detail.png");
} finally {
  await browser.close();
}

console.log(`Portfolio screenshots written to ${path.relative(rootDirectory, outputDirectory)}/`);

async function capture(page, pathname, filename, heading) {
  await page.goto(`${baseUrl}${pathname}`);
  await page.getByRole("heading", { name: heading }).waitFor();
  await captureCurrentPage(page, filename);
}

async function captureCurrentPage(page, filename) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((element) => element.remove()));
  await page.screenshot({
    path: path.join(outputDirectory, filename),
    animations: "disabled",
    caret: "hide",
  });
}

function readPublicFormSlug() {
  const code = "puts Workspace.find_by!(slug: DemoWorkspaceSeeder::WORKSPACE_SLUG).slug";
  return execFileSync("mise", ["exec", "--", "bundle", "exec", "rails", "runner", code], {
    cwd: path.join(rootDirectory, "apps/api"),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function assertLocalUrl(value) {
  const hostname = new URL(value).hostname;
  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    throw new Error(`Refusing to capture an authenticated non-local site: ${hostname}`);
  }
}

async function assertReachable(value) {
  try {
    const response = await fetch(value);
    if (!response.ok) throw new Error(String(response.status));
  } catch {
    throw new Error("The local web app is unavailable. Run `pnpm dev` before capturing the portfolio.");
  }
}
