import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/workspace/customer-form";
import { PageHeader } from "@/components/workspace/page-header";
import { getAccount, getCustomer, RailsApiError } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Edit customer" };

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const customerId = Number((await params).id);
  if (!Number.isInteger(customerId) || customerId <= 0) notFound();

  const account = await getAccount();
  const workspace = account!.workspaces[0];
  let result;
  try {
    result = await getCustomer(workspace.id, customerId);
  } catch (error) {
    if (error instanceof RailsApiError && error.status === 404) notFound();
    throw error;
  }
  if (!result) notFound();

  return (
    <>
      <PageHeader eyebrow={`CUSTOMERS / #${result.customer.id} / EDIT`} title={`Keep ${result.customer.name} accurate.`} description="Update the lightweight identity shared by every attached Signal without rewriting its history." backHref="/customers" />
      <div className="mx-auto max-w-[760px] px-4 py-8 md:px-6">
        <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7">
          <CustomerForm workspaceId={workspace.id} customer={result.customer} />
        </section>
      </div>
    </>
  );
}
