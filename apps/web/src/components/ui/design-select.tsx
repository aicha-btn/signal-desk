"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";

export type DesignSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function DesignSelect({
  id,
  name,
  defaultValue,
  options,
  ariaLabel,
  controlClassName = "app-form-control",
}: {
  id?: string;
  name: string;
  defaultValue?: string | number;
  options: DesignSelectOption[];
  ariaLabel?: string;
  controlClassName?: string;
}) {
  const initialValue = String(defaultValue ?? options[0]?.value ?? "");
  const [selection, setSelection] = useState({ source: initialValue, value: initialValue });
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const value = selection.source === initialValue ? selection.value : initialValue;
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[selectedIndex]?.focus();
  }, [open, selectedIndex]);

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setSelection({ source: initialValue, value: option.value });
    setOpen(false);
    triggerRef.current?.focus();
  };

  const focusRelativeOption = (currentIndex: number, direction: 1 | -1) => {
    let nextIndex = currentIndex;
    do {
      nextIndex = (nextIndex + direction + options.length) % options.length;
    } while (options[nextIndex]?.disabled && nextIndex !== currentIndex);
    optionRefs.current[nextIndex]?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusRelativeOption(index, event.key === "ArrowDown" ? 1 : -1);
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      optionRefs.current[event.key === "Home" ? 0 : options.length - 1]?.focus();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        ref={triggerRef}
        id={id}
        className={`${controlClassName} flex items-center justify-between gap-3 text-left font-semibold transition-colors hover:bg-[var(--acid-400)]`}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="min-w-0 truncate">{selectedOption?.label}</span>
        <ChevronDown aria-hidden="true" className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} size={18} strokeWidth={2.5} />
      </button>

      {open && (
        <div
          id={listboxId}
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-50 max-h-72 overflow-y-auto border-2 border-[var(--ink-950)] bg-[var(--paper-0)] shadow-[6px_6px_0_var(--ink-950)]"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => {
            const selected = option.value === value;
            return (
              <button
                ref={(node) => { optionRefs.current[index] = node; }}
                key={option.value}
                className={`flex min-h-11 w-full items-center justify-between gap-3 border-b border-[var(--ink-300)] px-3 text-left text-sm font-semibold last:border-b-0 disabled:cursor-not-allowed disabled:opacity-40 ${selected ? "bg-[var(--cobalt-500)] text-[var(--paper-0)]" : "bg-[var(--paper-0)] text-[var(--ink-950)] hover:bg-[var(--acid-400)]"}`}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                onClick={() => selectOption(index)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Check aria-hidden="true" className="shrink-0" size={17} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
