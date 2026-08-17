"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { RailsApiError, railsRequest, type Tag } from "@/lib/rails-api";

const createTagSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1, "Enter a tag name.").max(40, "Keep tag names under 40 characters."),
});

const deleteTagSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  tagId: z.coerce.number().int().positive(),
});

export type TagFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createTag(
  _previousState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  const parsed = createTagSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the tag name.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const result = await railsRequest<{ tag: Tag }>(
      `/api/v1/workspaces/${parsed.data.workspaceId}/tags`,
      { method: "POST", body: JSON.stringify({ name: parsed.data.name }) },
    );
    if (!result) return { status: "error", message: "Your session has expired." };
  } catch (error) {
    if (error instanceof RailsApiError) {
      return { status: "error", message: error.message, fieldErrors: error.details };
    }
    return { status: "error", message: "The tag could not be created. Try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/signal-feed");
  return { status: "success", message: "Tag created." };
}

export async function deleteTag(formData: FormData) {
  const parsed = deleteTagSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    tagId: formData.get("tagId"),
  });
  if (!parsed.success) return;

  await railsRequest<Record<string, never>>(
    `/api/v1/workspaces/${parsed.data.workspaceId}/tags/${parsed.data.tagId}`,
    { method: "DELETE" },
  );

  revalidatePath("/settings");
  revalidatePath("/signal-feed");
}
