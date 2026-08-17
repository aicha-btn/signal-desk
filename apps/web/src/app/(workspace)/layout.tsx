import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { getAccount } from "@/lib/rails-api";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const account = await getAccount();
  if (!account) redirect("/login");
  if (account.onboarding_required) redirect("/onboarding");

  return (
    <WorkspaceShell account={account} workspace={account.workspaces[0]}>
      {children}
    </WorkspaceShell>
  );
}
