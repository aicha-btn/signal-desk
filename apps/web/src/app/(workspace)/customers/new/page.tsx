import type { Metadata } from "next";
import { CustomerForm } from "@/components/workspace/customer-form";
import { PageHeader } from "@/components/workspace/page-header";
import { getAccount } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Add customer" };

export default async function NewCustomerPage() {
  const account = await getAccount();
  return (
    <>
      <PageHeader eyebrow="CUSTOMERS / NEW PROFILE" title="Give the Signal a source." description="Create a lightweight customer identity now. Their Signal history will build itself as the team captures evidence." backHref="/customers" />
      <div className="mx-auto max-w-[760px] px-4 py-8 md:px-6"><section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)] p-5 md:p-7"><CustomerForm workspaceId={account!.workspaces[0].id} /></section></div>
    </>
  );
}
