"use server";

import { z } from "zod";

const formSchema = z.object({
  email: z.email("Enter a valid work email.").max(254),
  company: z.string().trim().max(100, "Keep the company name under 100 characters."),
  role: z.enum(["", "product", "support", "leadership", "founder", "other"]),
  teamSize: z.enum(["", "1-10", "11-50", "51-200", "201-1000", "1000+"]),
  website: z.string().max(200),
  consent: z.literal("on", { error: "Please confirm we can contact you." }),
});

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialLeadFormState: LeadFormState = {
  status: "idle",
  message: "",
};

export async function joinEarlyAccess(
  _previousState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = formSchema.safeParse({
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    role: formData.get("role") ?? "",
    teamSize: formData.get("teamSize") ?? "",
    website: formData.get("website") ?? "",
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const railsApiUrl = process.env.RAILS_API_URL ?? "http://127.0.0.1:3001";

  try {
    const response = await fetch(`${railsApiUrl}/api/v1/early_access_signups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        company: parsed.data.company,
        role: parsed.data.role,
        team_size: parsed.data.teamSize,
        website: parsed.data.website,
        consent: true,
        source: "landing",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        status: "error",
        message: "We couldn't save your request. Please try again.",
      };
    }

    return {
      status: "success",
      message: "Signal received. We'll be in touch with early access details.",
    };
  } catch {
    return {
      status: "error",
      message: "The line is briefly unavailable. Please try again in a moment.",
    };
  }
}
