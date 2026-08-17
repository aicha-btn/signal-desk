"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Comment } from "@/lib/rails-api";

const commentSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  feedbackId: z.coerce.number().int().positive(),
  body: z.string().trim().min(1, "Write a comment before posting.").max(5_000, "Keep comments under 5,000 characters."),
});

export type CommentFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createComment(
  _previousState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const parsed = commentSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    feedbackId: formData.get("feedbackId"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the comment.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    };
  }

  try {
    const result = await railsRequest<{ comment: Comment }>(
      `/api/v1/workspaces/${parsed.data.workspaceId}/feedbacks/${parsed.data.feedbackId}/comments`,
      { method: "POST", body: JSON.stringify({ body: parsed.data.body }) },
    );
    if (!result) return { status: "error", message: "Your session has expired." };
  } catch (error) {
    if (error instanceof RailsApiError) {
      return { status: "error", message: error.message, fieldErrors: error.details };
    }
    return { status: "error", message: "The comment could not be posted. Try again." };
  }

  revalidatePath(`/signals/${parsed.data.feedbackId}`);
  redirect(`/signals/${parsed.data.feedbackId}?commented=1#collaboration`);
}

export async function deleteComment(formData: FormData) {
  const parsed = z.object({
    workspaceId: z.coerce.number().int().positive(),
    feedbackId: z.coerce.number().int().positive(),
    commentId: z.coerce.number().int().positive(),
  }).safeParse({
    workspaceId: formData.get("workspaceId"),
    feedbackId: formData.get("feedbackId"),
    commentId: formData.get("commentId"),
  });
  if (!parsed.success) return;

  await railsRequest<Record<string, never>>(
    `/api/v1/workspaces/${parsed.data.workspaceId}/feedbacks/${parsed.data.feedbackId}/comments/${parsed.data.commentId}`,
    { method: "DELETE" },
  );
  revalidatePath(`/signals/${parsed.data.feedbackId}`);
}
