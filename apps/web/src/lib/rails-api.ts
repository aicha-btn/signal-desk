import "server-only";

import { createClient } from "@/lib/supabase/server";

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member";
  public_form_enabled: boolean;
};

export type Account = {
  user: {
    id: number;
    email: string;
    display_name: string | null;
  };
  workspaces: Workspace[];
  onboarding_required: boolean;
};

export class RailsApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function accessToken() {
  const supabase = await createClient();
  const { error: claimsError } = await supabase.auth.getClaims();
  if (claimsError) return null;

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function railsRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | null> {
  const token = await accessToken();
  if (!token) return null;

  const railsApiUrl = process.env.RAILS_API_URL ?? "http://127.0.0.1:3001";
  const response = await fetch(`${railsApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  const body = (await response.json()) as {
    error?: { message?: string; details?: Record<string, string[]> };
  } & T;

  if (!response.ok) {
    throw new RailsApiError(
      body.error?.message ?? "The request could not be completed.",
      response.status,
      body.error?.details,
    );
  }

  return body;
}

export function getAccount() {
  return railsRequest<Account>("/api/v1/me");
}
