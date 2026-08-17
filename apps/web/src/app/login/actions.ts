"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.email("Enter a valid work email."),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
  nextPath: z.string().optional(),
});

const signupSchema = credentialsSchema
  .extend({
    displayName: z.string().trim().min(2, "Enter your name.").max(80),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signIn(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    nextPath: formData.get("nextPath")?.toString(),
  });

  if (!parsed.success) return validationState(parsed.error.flatten().fieldErrors);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: "Email or password is incorrect." };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(parsed.data.nextPath, "/control-room"));
}

export async function signUp(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
    nextPath: formData.get("nextPath")?.toString(),
  });

  if (!parsed.success) return validationState(parsed.error.flatten().fieldErrors);

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const nextPath = safeNextPath(parsed.data.nextPath, "/onboarding");
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/", "layout");
  if (data.session) redirect(nextPath);

  return {
    status: "success",
    message: "Check your email to confirm your account, then return to sign in.",
  };
}

function safeNextPath(value: string | undefined, fallback: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function validationState(fieldErrors: Record<string, string[] | undefined>): AuthFormState {
  return {
    status: "error",
    message: "Check the highlighted fields.",
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1])),
    ),
  };
}
