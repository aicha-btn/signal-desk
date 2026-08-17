"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Workspace } from "@/lib/rails-api";

export type AcceptanceState = { status: "idle" | "error"; message: string };

export async function acceptInvitation(
  _previousState: AcceptanceState,
  formData: FormData,
): Promise<AcceptanceState> {
  const parsed = z.string().min(20).safeParse(formData.get("token"));
  if (!parsed.success) return { status: "error", message: "This invitation link is invalid." };

  try {
    const result = await railsRequest<{ membership: { id: number; role: string; workspace: Workspace } }>(
      `/api/v1/invitations/${encodeURIComponent(parsed.data)}/accept`,
      { method: "POST" },
    );
    if (!result) return { status: "error", message: "Sign in before accepting this invitation." };
  } catch (error) {
    if (error instanceof RailsApiError) return { status: "error", message: error.message };
    return { status: "error", message: "The invitation could not be accepted. Try again." };
  }

  redirect("/control-room?joined=1");
}
