"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Feedback } from "@/lib/rails-api";

const signalSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  title: z.string().trim().min(3, "Give the Signal a clear title.").max(160),
  description: z.string().trim().min(10, "Add enough context to make this Signal useful.").max(10_000),
  priority: z.enum(["low", "medium", "high", "critical"]),
  source: z.enum(["internal", "email", "support", "call", "other"]),
  customerId: z.string(),
  tagIds: z.array(z.coerce.number().int().positive()).max(20),
});

export type SignalFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createSignal(_previousState: SignalFormState, formData: FormData): Promise<SignalFormState> {
  const parsed = signalSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    source: formData.get("source"),
    customerId: formData.get("customerId") ?? "",
    tagIds: formData.getAll("tagIds"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))),
    };
  }

  try {
    const result = await railsRequest<{ feedback: Feedback }>(`/api/v1/workspaces/${parsed.data.workspaceId}/feedbacks`, {
      method: "POST",
      body: JSON.stringify({
        title: parsed.data.title,
        description: parsed.data.description,
        priority: parsed.data.priority,
        source: parsed.data.source,
        customer_id: parsed.data.customerId || undefined,
        tag_ids: parsed.data.tagIds,
      }),
    });
    if (!result) redirect("/login");
  } catch (error) {
    if (error instanceof RailsApiError) return { status: "error", message: error.message, fieldErrors: error.details };
    return { status: "error", message: "The Signal could not be captured. Try again." };
  }

  revalidatePath("/control-room");
  revalidatePath("/signal-feed");
  redirect("/signal-feed?created=1");
}
