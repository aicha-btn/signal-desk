import type { ReactNode } from "react";

export function PendingMark({ className = "" }: { className?: string }) {
  return (
    <span className={`signal-pending-mark ${className}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function PendingButtonContent({
  pending,
  idleLabel,
  pendingLabel,
  idleIcon,
}: {
  pending: boolean;
  idleLabel: string;
  pendingLabel: string;
  idleIcon?: ReactNode;
}) {
  return (
    <span className="pending-button-content">
      <span className="pending-button-state" aria-hidden={pending} data-hidden={pending}>
        {idleIcon}
        {idleLabel}
      </span>
      <span className="pending-button-state" aria-hidden={!pending} data-hidden={!pending}>
        <PendingMark />
        {pendingLabel}
      </span>
    </span>
  );
}
