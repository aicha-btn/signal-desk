import type { Tag } from "@/lib/rails-api";

export function TagSelector({
  tags,
  selectedIds = [],
}: {
  tags: Tag[];
  selectedIds?: number[];
}) {
  if (!tags.length) return null;

  const selected = new Set(selectedIds);

  return (
    <fieldset>
      <legend className="app-form-label">Tags</legend>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <label key={tag.id} className="cursor-pointer">
            <input
              className="peer sr-only"
              type="checkbox"
              name="tagIds"
              value={tag.id}
              defaultChecked={selected.has(tag.id)}
            />
            <span className="inline-flex min-h-10 items-center border-2 border-[var(--ink-300)] bg-[var(--paper-0)] px-3 font-mono text-xs transition-colors peer-checked:border-[var(--ink-950)] peer-checked:bg-[var(--acid-400)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--cobalt-500)]">
              {tag.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
