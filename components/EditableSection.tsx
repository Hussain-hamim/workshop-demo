"use client";

import { Textarea } from "@/components/ui/textarea";

type Props = {
  editing: boolean;
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  list?: boolean;
};

export function EditableSection({
  editing,
  label,
  value,
  onChange,
  list = false,
}: Props) {
  const text = Array.isArray(value) ? value.join("\n") : value;

  return (
    <section className="space-y-2">
      {label ? (
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </h3>
      ) : null}
      {editing ? (
        <Textarea
          className="min-h-[88px] rounded-xl bg-background text-sm leading-relaxed"
          value={text}
          onChange={(e) =>
            list
              ? onChange(e.target.value.split("\n"))
              : onChange(e.target.value)
          }
        />
      ) : list && Array.isArray(value) ? (
        <ul className="space-y-1.5 text-sm leading-relaxed text-foreground">
          {value.filter(Boolean).map((item, i) => (
            <li key={`${item}-${i}`} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {text || "—"}
        </p>
      )}
    </section>
  );
}
