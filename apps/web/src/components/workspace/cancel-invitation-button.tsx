"use client";

import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { PendingButtonContent } from "@/components/ui/pending-feedback";

export function CancelInvitationButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-secondary min-w-[130px]" type="submit" disabled={pending} aria-busy={pending}>
      <PendingButtonContent pending={pending} idleLabel="Cancel" pendingLabel="Cancelling..." idleIcon={<X aria-hidden="true" size={17} />} />
    </button>
  );
}
