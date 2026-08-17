"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type WorkspaceInvitation } from "@/lib/rails-api";

const invitationSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  email: z.email("Enter a valid work email.").transform((value) => value.trim().toLowerCase()),
  role: z.enum(["admin", "member"]),
});

export type InvitationFormState = {
  status: "idle" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function inviteMember(
  _previousState: InvitationFormState,
  formData: FormData,
): Promise<InvitationFormState> {
  const parsed = invitationSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the invitation details.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]),
        ),
      ),
    };
  }

  try {
    const result = await railsRequest<{ invitation: WorkspaceInvitation }>(
      `/api/v1/workspaces/${parsed.data.workspaceId}/invitations`,
      { method: "POST", body: JSON.stringify({ email: parsed.data.email, role: parsed.data.role }) },
    );
    if (!result) return { status: "error", message: "Your session has expired." };
  } catch (error) {
    if (error instanceof RailsApiError) {
      return { status: "error", message: error.message, fieldErrors: error.details };
    }
    return { status: "error", message: "The invitation could not be sent. Try again." };
  }

  revalidatePath("/members");
  redirect("/members?invited=1");
}

export async function cancelInvitation(formData: FormData) {
  const parsed = z.object({
    workspaceId: z.coerce.number().int().positive(),
    invitationId: z.coerce.number().int().positive(),
  }).safeParse({
    workspaceId: formData.get("workspaceId"),
    invitationId: formData.get("invitationId"),
  });
  if (!parsed.success) return;

  await railsRequest<Record<string, never>>(
    `/api/v1/workspaces/${parsed.data.workspaceId}/invitations/${parsed.data.invitationId}`,
    { method: "DELETE" },
  );
  revalidatePath("/members");
  redirect("/members?cancelled=1");
}
