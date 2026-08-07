"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Workspace } from "@/lib/rails-api";

const onboardingSchema = z.object({
  displayName: z.string().trim().min(2, "Enter your name.").max(80),
  workspaceName: z.string().trim().min(2, "Enter a workspace name.").max(100),
});

export type OnboardingState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createWorkspace(
  _previousState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const parsed = onboardingSchema.safeParse({
    displayName: formData.get("displayName"),
    workspaceName: formData.get("workspaceName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    };
  }

  try {
    const result = await railsRequest<{ workspace: Workspace }>("/api/v1/onboarding", {
      method: "POST",
      body: JSON.stringify({
        display_name: parsed.data.displayName,
        workspace_name: parsed.data.workspaceName,
      }),
    });

    if (!result) redirect("/login");
  } catch (error) {
    if (error instanceof RailsApiError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: error.details?.name
          ? { workspaceName: error.details.name }
          : undefined,
      };
    }

    return { status: "error", message: "The workspace could not be created. Try again." };
  }

  revalidatePath("/control-room");
  redirect("/control-room");
}
