import { execFileSync } from "node:child_process";
import { chmod, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

const PROJECT_REF = "svrwsnxhixlpjxxspebd";
const OWNER_EMAIL = "aboutinea@gmail.com";
const WORKSPACE_SLUG = "budary";
const WORKSPACE_NAME = "Budary Product Studio";
const DATABASE_HOST = "aws-1-eu-west-3.pooler.supabase.com";
const DATABASE_PORT = "6543";
const rootDirectory = process.cwd();
const credentialsPath = path.join(rootDirectory, ".signaldesk-production-demo-accounts.md");

const team = [
  { key: "nora", email: "nora.okafor@signaldesk-demo.test", display_name: "Nora Okafor", role: "admin" },
  { key: "mika", email: "mika.laurent@signaldesk-demo.test", display_name: "Mika Laurent", role: "member" },
  { key: "amir", email: "amir.haddad@signaldesk-demo.test", display_name: "Amir Haddad", role: "member" },
  { key: "ines", email: "ines.martin@signaldesk-demo.test", display_name: "Ines Martin", role: "admin" },
  { key: "lucas", email: "lucas.meyer@signaldesk-demo.test", display_name: "Lucas Meyer", role: "member" },
  { key: "sara", email: "sara.kovac@signaldesk-demo.test", display_name: "Sara Kovac", role: "member" },
  { key: "theo", email: "theo.bernard@signaldesk-demo.test", display_name: "Theo Bernard", role: "member" },
];

if (!process.argv.includes("--confirm-production")) {
  throw new Error("Refusing to modify production without --confirm-production.");
}

const databasePassword = process.env.SUPABASE_DB_PASSWORD;
if (!databasePassword) {
  throw new Error("SUPABASE_DB_PASSWORD is required.");
}

const accessToken = readManagementAccessToken();
const serviceRoleKey = await readServiceRoleKey(accessToken);
const authConfig = {
  apiUrl: `https://${PROJECT_REF}.supabase.co`,
  serviceRoleKey,
};
const users = await listAuthUsers(authConfig);
const owner = users.find((user) => user.email?.toLowerCase() === OWNER_EMAIL);
if (!owner?.email_confirmed_at) {
  throw new Error(`Confirmed production owner ${OWNER_EMAIL} was not found.`);
}

const credentials = [];
const teamAttributes = {};
for (const definition of team) {
  const password = createPassword();
  const user = await provisionAuthUser(authConfig, users, definition, password);
  credentials.push({ ...definition, password, supabase_user_id: user.id });
  teamAttributes[definition.key] = {
    supabase_user_id: user.id,
    email: definition.email,
    display_name: definition.display_name,
  };
}

const summary = seedRailsWorkspace(owner, teamAttributes, databasePassword);
await writeCredentials(credentials, summary);

console.log("\nSignalDesk production demo data is ready.\n");
console.log(`Owner:       ${OWNER_EMAIL} (existing password unchanged)`);
console.log(`Workspace:   ${summary.workspace_slug}`);
console.log(`Data:        ${summary.feedbacks} Signals, ${summary.customers} customers, ${summary.members} members`);
console.log(`Credentials: ${credentialsPath}`);

function readManagementAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;

  try {
    return execFileSync(
      "security",
      ["find-generic-password", "-a", "supabase", "-s", "Supabase CLI", "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ).trim();
  } catch {
    throw new Error("Supabase CLI authentication was not found in the macOS keychain.");
  }
}

async function readServiceRoleKey(accessToken) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const body = await readJson(response);
  const key = Array.isArray(body) && body.find((entry) => entry.name === "service_role")?.api_key;
  if (!response.ok || !key) {
    throw new Error(`Could not read the production API keys: ${messageFrom(body, response.status)}`);
  }
  return key;
}

async function listAuthUsers(config) {
  const response = await adminRequest(config, "/auth/v1/admin/users?per_page=1000", { method: "GET" });
  const body = await readJson(response);
  if (!response.ok || !Array.isArray(body.users)) {
    throw new Error(`Could not inspect production users: ${messageFrom(body, response.status)}`);
  }
  return body.users;
}

async function provisionAuthUser(config, users, definition, password) {
  const existing = users.find((user) => user.email?.toLowerCase() === definition.email);
  const pathname = existing ? `/auth/v1/admin/users/${existing.id}` : "/auth/v1/admin/users";
  const response = await adminRequest(config, pathname, {
    method: existing ? "PUT" : "POST",
    body: JSON.stringify({
      email: definition.email,
      password,
      email_confirm: true,
      user_metadata: { display_name: definition.display_name },
    }),
  });
  const body = await readJson(response);
  if (!response.ok || !body.id) {
    throw new Error(`Could not provision ${definition.email}: ${messageFrom(body, response.status)}`);
  }
  return body;
}

function seedRailsWorkspace(owner, teamAttributes, databasePassword) {
  const code = [
    "owner = User.find_by!(email: ENV.fetch('DEMO_OWNER_EMAIL'))",
    "workspace = owner.workspaces.find_by!(slug: ENV.fetch('DEMO_WORKSPACE_SLUG'))",
    "team = JSON.parse(ENV.fetch('DEMO_TEAM_JSON'), symbolize_names: true)",
    "result = DemoWorkspaceSeeder.call(owner_attributes: { supabase_user_id: ENV.fetch('DEMO_OWNER_ID'), email: ENV.fetch('DEMO_OWNER_EMAIL'), display_name: 'Lila' }, team_attributes: team, workspace: workspace, workspace_name: ENV.fetch('DEMO_WORKSPACE_NAME'))",
    "puts result.to_json",
  ].join("; ");
  const databaseUrl = new URL("postgresql://postgres:placeholder@localhost/postgres");
  databaseUrl.username = `postgres.${PROJECT_REF}`;
  databaseUrl.password = databasePassword;
  databaseUrl.hostname = DATABASE_HOST;
  databaseUrl.port = DATABASE_PORT;
  databaseUrl.searchParams.set("sslmode", "require");

  const output = execFileSync("mise", ["exec", "--", "bundle", "exec", "rails", "runner", code], {
    cwd: path.join(rootDirectory, "apps/api"),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      RAILS_ENV: "production",
      DATABASE_URL: databaseUrl.toString(),
      DEMO_OWNER_ID: owner.id,
      DEMO_OWNER_EMAIL: OWNER_EMAIL,
      DEMO_WORKSPACE_SLUG: WORKSPACE_SLUG,
      DEMO_WORKSPACE_NAME: WORKSPACE_NAME,
      DEMO_TEAM_JSON: JSON.stringify(teamAttributes),
    },
  });

  return JSON.parse(output.trim().split("\n").at(-1));
}

async function writeCredentials(credentials, summary) {
  const rows = credentials.map((account) =>
    `| ${account.display_name} | ${account.role} | ${account.email} | \`${account.password}\` |`,
  );
  const content = [
    "# SignalDesk production demo accounts",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `Production: https://signal-desk-lake.vercel.app/login`,
    `Workspace: ${summary.workspace_slug}`,
    "",
    `Principal account: ${OWNER_EMAIL}`,
    "Its existing password was not read or changed.",
    "",
    "| Name | Role | Email | Password |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    "This file contains production credentials. It is ignored by Git and must stay local.",
    "",
  ].join("\n");

  await writeFile(credentialsPath, content, { encoding: "utf8", mode: 0o600 });
  await chmod(credentialsPath, 0o600);
}

function createPassword() {
  return `${randomBytes(18).toString("base64url")}!7aA`;
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
