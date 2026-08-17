"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Customer } from "@/lib/rails-api";

const customerSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  name: z.string().trim().min(2, "Enter the customer name.").max(100),
  company: z.string().trim().max(100),
  email: z.union([z.literal(""), z.email("Enter a valid email.")]),
});

export type CustomerFormState = { status: "idle" | "error"; message: string; fieldErrors?: Record<string, string[]> };

export async function createCustomer(_previousState: CustomerFormState, formData: FormData): Promise<CustomerFormState> {
  const parsed = customerSchema.safeParse({ workspaceId: formData.get("workspaceId"), name: formData.get("name"), company: formData.get("company") ?? "", email: formData.get("email") ?? "" });
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) };

  try {
    const result = await railsRequest<{ customer: Customer }>(`/api/v1/workspaces/${parsed.data.workspaceId}/customers`, { method: "POST", body: JSON.stringify(parsed.data) });
    if (!result) redirect("/login");
  } catch (error) {
    if (error instanceof RailsApiError) return { status: "error", message: error.message, fieldErrors: error.details };
    return { status: "error", message: "The customer could not be created. Try again." };
  }
  revalidatePath("/customers");
  redirect("/customers?created=1");
}
