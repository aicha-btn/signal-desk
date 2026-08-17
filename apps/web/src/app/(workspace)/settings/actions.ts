"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { RailsApiError, railsRequest, type Workspace } from "@/lib/rails-api";

const settingsSchema = z.object({ workspaceId: z.coerce.number().int().positive(), name: z.string().trim().min(2, "Enter a workspace name.").max(100) });
export type SettingsFormState = { status: "idle" | "error" | "success"; message: string; fieldErrors?: Record<string, string[]> };

export async function updateWorkspace(_previousState: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const parsed = settingsSchema.safeParse({ workspaceId: formData.get("workspaceId"), name: formData.get("name") });
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) };
  try {
    const result = await railsRequest<{ workspace: Workspace }>(`/api/v1/workspaces/${parsed.data.workspaceId}`, { method: "PATCH", body: JSON.stringify({ name: parsed.data.name }) });
    if (!result) return { status: "error", message: "Your session has expired." };
  } catch (error) {
    if (error instanceof RailsApiError) return { status: "error", message: error.message, fieldErrors: error.details };
    return { status: "error", message: "Settings could not be saved. Try again." };
  }
  revalidatePath("/", "layout");
  return { status: "success", message: "Workspace settings saved." };
}
