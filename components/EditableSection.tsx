"use client";

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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </h3>
      ) : null}
      {editing ? (
        <textarea
          className="min-h-[88px] w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20"
          value={text}
          onChange={(e) =>
            list
              ? onChange(e.target.value.split("\n"))
              : onChange(e.target.value)
          }
        />
      ) : list && Array.isArray(value) ? (
        <ul className="space-y-1.5 text-sm leading-relaxed text-slate-800">
          {value.filter(Boolean).map((item, i) => (
            <li key={`${item}-${i}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-800" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
          {text || "—"}
        </p>
      )}
    </section>
  );
}
