"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const FALLBACK_TIMEOUT = 12_000;

export function NavigationFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const routeKey = `${pathname}?${searchParams.toString()}`;

  const stop = useCallback(() => {
    setPending(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const start = useCallback(() => {
    setPending(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(stop, FALLBACK_TIMEOUT);
  }, [stop]);

  useEffect(() => {
    const routeSettled = window.setTimeout(stop, 0);
    return () => window.clearTimeout(routeSettled);
  }, [routeKey, stop]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download") || anchor.dataset.noNavigationFeedback === "true") return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const currentRoute = `${window.location.pathname}${window.location.search}`;
      const nextRoute = `${destination.pathname}${destination.search}`;
      if (currentRoute === nextRoute) return;

      start();
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== "get") return;
      start();
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    window.addEventListener("popstate", start);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
      window.removeEventListener("popstate", start);
    };
  }, [start]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-navigation-pending", pending);
    return () => document.documentElement.removeAttribute("data-navigation-pending");
  }, [pending]);

  return (
    <div className="route-feedback" data-visible={pending} aria-hidden={!pending}>
      <div className="route-feedback-signal">
        <span />
        <span />
        <span />
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {pending ? "Loading the next view" : ""}
      </span>
    </div>
  );
}
