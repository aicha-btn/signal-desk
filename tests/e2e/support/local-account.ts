import { execFileSync } from "node:child_process";
import path from "node:path";

type LocalAccount = {
  id: string;
  email: string;
  password: string;
};

type SupabaseLocalConfig = {
  apiUrl: string;
  serviceRoleKey: string;
};

export type LocalPublicWorkspace = {
  slug: string;
};

const rootDirectory = process.cwd();

export async function createLocalAccount(): Promise<LocalAccount> {
  const config = readSupabaseLocalConfig();
  const runId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const email = `signaldesk-e2e-${runId}@example.test`;
  const password = "SignalDesk-E2E-2026!";
  const response = await adminRequest(config, "/auth/v1/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "E2E Operator" },
    }),
  });
  const body = await response.json() as { id?: string; message?: string };

  if (!response.ok || !body.id) {
    throw new Error(`Could not provision the local E2E account: ${body.message ?? response.status}`);
  }

  return { id: body.id, email, password };
}

export async function removeLocalAccount(account: LocalAccount | undefined) {
  if (!account) return;

  cleanupRailsUser(account.id);
  const config = readSupabaseLocalConfig();
  const response = await adminRequest(config, `/auth/v1/admin/users/${account.id}`, { method: "DELETE" });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Could not remove the local E2E account: ${response.status}`);
  }
}

export function createLocalPublicWorkspace(): LocalPublicWorkspace {
  const slug = `signaldesk-public-e2e-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const code = [
    "Workspace.create!(",
    'name: "Public E2E Studio",',
    `slug: ${JSON.stringify(slug)},`,
    "public_form_token: SecureRandom.urlsafe_base64(18),",
    "public_form_enabled: true)",
  ].join(" ");
  runRails(code);
  return { slug };
}

export function removeLocalPublicWorkspace(workspace: LocalPublicWorkspace | undefined) {
  if (!workspace) return;
  runRails(`Workspace.find_by(slug: ${JSON.stringify(workspace.slug)})&.destroy!`);
}

function readSupabaseLocalConfig(): SupabaseLocalConfig {
  let output: string;
  try {
    output = execFileSync("pnpm", ["exec", "supabase", "status", "-o", "env"], {
      cwd: rootDirectory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    throw new Error("Local Supabase is unavailable. Run `pnpm supabase:start` before the E2E suite.");
  }

  const apiUrl = readEnvValue(output, "API_URL");
  const serviceRoleKey = readEnvValue(output, "SERVICE_ROLE_KEY");
  if (!apiUrl || !serviceRoleKey) {
    throw new Error("Local Supabase did not expose the API URL and service role key.");
  }

  return { apiUrl, serviceRoleKey };
}

function readEnvValue(output: string, name: string) {
  return output.match(new RegExp(`^${name}="([^"]+)"$`, "m"))?.[1];
}

function adminRequest(config: SupabaseLocalConfig, pathname: string, init: RequestInit) {
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

function cleanupRailsUser(supabaseUserId: string) {
  const code = `User.find_by(supabase_user_id: ${JSON.stringify(supabaseUserId)})&.destroy!`;
  runRails(code);
}

function runRails(code: string) {
  return execFileSync("mise", ["exec", "--", "bundle", "exec", "rails", "runner", code], {
    cwd: path.join(rootDirectory, "apps/api"),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
