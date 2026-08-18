"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RailsApiError, railsRequest, type Customer } from "@/lib/rails-api";

const customerSchema = z.object({
  workspaceId: z.coerce.number().int().positive(),
  customerId: z.coerce.number().int().positive().optional(),
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

export async function updateCustomer(_previousState: CustomerFormState, formData: FormData): Promise<CustomerFormState> {
  const parsed = customerSchema.required({ customerId: true }).safeParse({
    workspaceId: formData.get("workspaceId"),
    customerId: formData.get("customerId"),
    name: formData.get("name"),
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
  });
  if (!parsed.success) return { status: "error", message: "Check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) };

  try {
    const result = await railsRequest<{ customer: Customer }>(
      `/api/v1/workspaces/${parsed.data.workspaceId}/customers/${parsed.data.customerId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
        }),
      },
    );
    if (!result) return { status: "error", message: "Your session has expired. Sign in again." };
  } catch (error) {
    if (error instanceof RailsApiError) return { status: "error", message: error.message, fieldErrors: error.details };
    return { status: "error", message: "The customer could not be updated. Try again." };
  }

  revalidateCustomerViews();
  redirect("/customers?updated=1");
}

export async function deleteCustomer(formData: FormData) {
  const parsed = customerSchema.pick({ workspaceId: true }).extend({ customerId: z.coerce.number().int().positive() }).safeParse({
    workspaceId: formData.get("workspaceId"),
    customerId: formData.get("customerId"),
  });
  if (!parsed.success) return;

  await railsRequest<Record<string, never>>(
    `/api/v1/workspaces/${parsed.data.workspaceId}/customers/${parsed.data.customerId}`,
    { method: "DELETE" },
  );

  revalidateCustomerViews();
  redirect("/customers?deleted=1");
}

function revalidateCustomerViews() {
  revalidatePath("/customers");
  revalidatePath("/signal-feed");
  revalidatePath("/control-room");
  revalidatePath("/signals/[id]", "page");
}
