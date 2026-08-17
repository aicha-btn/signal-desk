import "server-only";

import { cache } from "react";
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

export type Feedback = {
  id: number;
  title: string;
  description: string;
  status: "new" | "reviewing" | "planned" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  source: "internal" | "public_form" | "email" | "support" | "call" | "other";
  customer: Pick<Customer, "id" | "name" | "company"> | null;
  created_by: {
    id: number;
    display_name: string | null;
    email: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  signals_count: number;
  created_at: string;
};

export type Member = {
  id: number;
  role: "owner" | "admin" | "member";
  joined_at: string;
  user: {
    id: number;
    email: string;
    display_name: string | null;
  };
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

  const responseText = await response.text();
  const body = (responseText ? JSON.parse(responseText) : {}) as {
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

export const getAccount = cache(() => railsRequest<Account>("/api/v1/me"));

export function getFeedbacks(
  workspaceId: number,
  filters: { query?: string; status?: string; priority?: string } = {},
) {
  const query = new URLSearchParams(
    Object.entries(filters).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
  const suffix = query.size ? `?${query.toString()}` : "";
  return railsRequest<{ feedbacks: Feedback[]; total: number }>(
    `/api/v1/workspaces/${workspaceId}/feedbacks${suffix}`,
  );
}

export function getFeedback(workspaceId: number, feedbackId: number) {
  return railsRequest<{ feedback: Feedback }>(
    `/api/v1/workspaces/${workspaceId}/feedbacks/${feedbackId}`,
  );
}

export function getCustomers(workspaceId: number) {
  return railsRequest<{ customers: Customer[] }>(
    `/api/v1/workspaces/${workspaceId}/customers`,
  );
}

export function getMembers(workspaceId: number) {
  return railsRequest<{ members: Member[] }>(
    `/api/v1/workspaces/${workspaceId}/members`,
  );
}
