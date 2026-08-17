"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Feedback } from "@/lib/rails-api";

const signalSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  feedbackId: z.coerce.number().int().positive(),
  title: z.string().trim().min(3, "Give the Signal a clear title.").max(160),
  description: z.string().trim().min(10, "Add enough context to make this Signal useful.").max(10_000),
  status: z.enum(["new", "reviewing", "planned", "resolved"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  source: z.enum(["internal", "public_form", "email", "support", "call", "other"]),
  customerId: z.string(),
});

const identitySchema = signalSchema.pick({ workspaceId: true, feedbackId: true });

export type SignalDetailFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateSignal(
  _previousState: SignalDetailFormState,
  formData: FormData,
): Promise<SignalDetailFormState> {
  const parsed = signalSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    feedbackId: formData.get("feedbackId"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    source: formData.get("source"),
    customerId: formData.get("customerId") ?? "",
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
    const result = await railsRequest<{ feedback: Feedback }>(
      `/api/v1/workspaces/${parsed.data.workspaceId}/feedbacks/${parsed.data.feedbackId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          title: parsed.data.title,
          description: parsed.data.description,
          status: parsed.data.status,
          priority: parsed.data.priority,
          source: parsed.data.source,
          customer_id: parsed.data.customerId || null,
        }),
      },
    );

    if (!result) return { status: "error", message: "Your session has expired. Sign in again." };
  } catch (error) {
    if (error instanceof RailsApiError) {
      return { status: "error", message: error.message, fieldErrors: error.details };
    }
    return { status: "error", message: "The Signal could not be updated. Try again." };
  }

  revalidatePath(`/signals/${parsed.data.feedbackId}`);
  revalidatePath("/signal-feed");
  revalidatePath("/control-room");
  redirect(`/signals/${parsed.data.feedbackId}?updated=1`);
}

export async function deleteSignal(formData: FormData) {
  const parsed = identitySchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    feedbackId: formData.get("feedbackId"),
  });

  if (!parsed.success) return;

  await railsRequest<Record<string, never>>(
    `/api/v1/workspaces/${parsed.data.workspaceId}/feedbacks/${parsed.data.feedbackId}`,
    { method: "DELETE" },
  );

  revalidatePath("/signal-feed");
  revalidatePath("/control-room");
  redirect("/signal-feed?deleted=1");
}
