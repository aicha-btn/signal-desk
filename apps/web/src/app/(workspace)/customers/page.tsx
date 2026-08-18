import type { Metadata } from "next";
import { Building2, Mail } from "lucide-react";
import { CustomerActions } from "@/components/workspace/customer-actions";
import { PageHeader } from "@/components/workspace/page-header";
import { getAccount, getCustomers } from "@/lib/rails-api";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ created?: string; updated?: string; deleted?: string }> }) {
  const { created, updated, deleted } = await searchParams;
  const account = await getAccount();
  const workspace = account!.workspaces[0];
  const result = await getCustomers(workspace.id);
  const customers = result?.customers ?? [];

  return (
    <>
      <PageHeader eyebrow="CUSTOMERS / SIGNAL SOURCES" title="Know who is feeling the friction." description="Keep customer identity close to the Signals it gives meaning to, without turning the workspace into a heavy CRM." action={{ label: "Add customer", href: "/customers/new" }} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-6 md:py-8">
        {created === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Customer created and ready to attach to Signals.</p>}
        {updated === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--mint-500)] px-4 py-3 text-sm font-bold" role="status">Customer updated across the workspace.</p>}
        {deleted === "1" && <p className="mb-5 border-2 border-[var(--ink-950)] bg-[var(--acid-400)] px-4 py-3 text-sm font-bold" role="status">Customer deleted. Attached Signals were kept without a customer.</p>}
        <section className="border-2 border-[var(--ink-950)] bg-[var(--paper-0)]">
          <div className="flex min-h-14 items-center justify-between border-b-2 border-[var(--ink-950)] px-4 md:px-5"><h2 className="font-display text-lg font-bold">Customer index</h2><span className="font-mono text-[10px] text-[var(--ink-600)]">{customers.length} CUSTOMERS</span></div>
          {customers.length ? (
            <div className="divide-y-2 divide-[var(--ink-950)]">
              {customers.map((customer) => (
                <article key={customer.id} className="grid gap-4 px-4 py-5 md:grid-cols-[48px_minmax(0,1fr)_minmax(160px,0.6fr)_100px_104px] md:items-center md:px-5">
                  <span className="flex size-11 items-center justify-center border-2 border-[var(--ink-950)] bg-[var(--cyan-400)]"><Building2 aria-hidden="true" size={20} /></span>
                  <div><h3 className="font-display text-lg font-bold">{customer.name}</h3><p className="text-sm text-[var(--ink-600)]">{customer.company || "Independent"}</p></div>
                  <p className="flex items-center gap-2 text-sm"><Mail aria-hidden="true" size={15} /> {customer.email || "No email"}</p>
                  <p className="font-mono text-[10px]">{customer.signals_count} SIGNALS</p>
                  <CustomerActions workspaceId={workspace.id} customerId={customer.id} name={customer.name} signalsCount={customer.signals_count} />
                </article>
              ))}
            </div>
          ) : (
            <div className="grid min-h-[280px] place-items-center p-6 text-center"><div><Building2 className="mx-auto text-[var(--cobalt-500)]" size={42} /><h3 className="mt-5 font-display text-2xl font-bold">No customers yet.</h3><p className="mt-3 text-[var(--ink-600)]">Add the first customer, then attach them while capturing a Signal.</p></div></div>
          )}
        </section>
      </div>
    </>
  );
}
