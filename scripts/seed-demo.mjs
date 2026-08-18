import { execFileSync } from "node:child_process";
import path from "node:path";

const rootDirectory = process.cwd();
const email = process.env.DEMO_EMAIL ?? "demo@signaldesk.test";
const password = process.env.DEMO_PASSWORD ?? "SignalDesk-Demo-2026!";
const displayName = process.env.DEMO_DISPLAY_NAME ?? "Maya Chen";

const config = readSupabaseLocalConfig();
assertLocalUrl(config.apiUrl);
const account = await provisionAccount(config);
const summary = seedRailsWorkspace(account.id);

console.log("\nSignalDesk demo workspace is ready.\n");
console.log(`Sign in:     http://localhost:3000/login`);
console.log(`Email:       ${email}`);
console.log(`Password:    ${password}`);
console.log(`Workspace:   ${summary.workspace_slug}`);
console.log(`Public form: http://localhost:3000/public/${summary.public_form_token}`);
console.log(`Data:        ${summary.feedbacks} Signals, ${summary.customers} customers, ${summary.members} members`);

function readSupabaseLocalConfig() {
  let output;
  try {
    output = execFileSync("pnpm", ["exec", "supabase", "status", "-o", "env"], {
      cwd: rootDirectory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    throw new Error("Local Supabase is unavailable. Run `pnpm supabase:start` first.");
  }

  const apiUrl = readEnvValue(output, "API_URL");
  const serviceRoleKey = readEnvValue(output, "SERVICE_ROLE_KEY");
  if (!apiUrl || !serviceRoleKey) {
    throw new Error("Local Supabase did not expose its API URL and service role key.");
  }

  return { apiUrl, serviceRoleKey };
}

function readEnvValue(output, name) {
  return output.match(new RegExp(`^${name}="([^"]+)"$`, "m"))?.[1];
}

function assertLocalUrl(apiUrl) {
  const hostname = new URL(apiUrl).hostname;
  if (!["localhost", "127.0.0.1", "::1"].includes(hostname)) {
    throw new Error(`Refusing to seed a non-local Supabase project: ${hostname}`);
  }
}

async function provisionAccount(config) {
  const listResponse = await adminRequest(config, "/auth/v1/admin/users?per_page=1000", { method: "GET" });
  const listBody = await readJson(listResponse);
  if (!listResponse.ok) {
    throw new Error(`Could not inspect local Supabase users: ${messageFrom(listBody, listResponse.status)}`);
  }

  const existing = listBody.users?.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  const pathname = existing ? `/auth/v1/admin/users/${existing.id}` : "/auth/v1/admin/users";
  const response = await adminRequest(config, pathname, {
    method: existing ? "PUT" : "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    }),
  });
  const body = await readJson(response);

  if (!response.ok || !body.id) {
    throw new Error(`Could not provision the local demo account: ${messageFrom(body, response.status)}`);
  }

  return body;
}

function seedRailsWorkspace(supabaseUserId) {
  const code = [
    "result = DemoWorkspaceSeeder.call(owner_attributes: {",
    "supabase_user_id: ENV.fetch('DEMO_SUPABASE_USER_ID'),",
    "email: ENV.fetch('DEMO_EMAIL'),",
    "display_name: ENV.fetch('DEMO_DISPLAY_NAME')",
    "}); puts result.to_json",
  ].join(" ");

  const output = execFileSync("mise", ["exec", "--", "bundle", "exec", "rails", "runner", code], {
    cwd: path.join(rootDirectory, "apps/api"),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      DEMO_SUPABASE_USER_ID: supabaseUserId,
      DEMO_EMAIL: email,
      DEMO_DISPLAY_NAME: displayName,
    },
  });

  return JSON.parse(output.trim().split("\n").at(-1));
}

function adminRequest(config, pathname, init) {
  return fetch(`${config.apiUrl}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.serviceRoleKey}`,
      apikey: config.serviceRoleKey,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function messageFrom(body, fallback) {
  return body.message ?? body.msg ?? body.error_description ?? body.error ?? fallback;
}
