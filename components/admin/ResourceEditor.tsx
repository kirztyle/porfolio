"use client";

import { useState } from "react";

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
  hint?: string;
  half?: boolean; // render side-by-side on desktop
};

type Item = Record<string, string | number | null | undefined>;

type Props = {
  endpoint: string; // e.g. "/api/experiences"
  fields: Field[];
  initialItems: Item[];
  itemTitle: (item: Item) => string;
  itemSubtitle?: (item: Item) => string;
  emptyItem: Item;
};

export default function ResourceEditor({
  endpoint,
  fields,
  initialItems,
  itemTitle,
  itemSubtitle,
  emptyItem,
}: Props) {
  const [items, setItems] = useState<Item[]>(
    [...initialItems].sort(
      (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)
    )
  );
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Item>(emptyItem);
  const [saving, setSaving] = useState(false);

  function startEdit(item: Item) {
    setEditingId(Number(item.id));
    setDraft(item);
  }

  function startNew() {
    setEditingId("new");
    setDraft({ ...emptyItem, sort_order: items.length });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyItem);
  }

  async function save() {
    setSaving(true);
    try {
      if (editingId === "new") {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        const created = await res.json();
        setItems((prev) => [...prev, created]);
      } else {
        const res = await fetch(`${endpoint}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        const updated = await res.json();
        setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      }
      cancelEdit();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Hapus data ini?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function move(id: number, dir: -1 | 1) {
    const idx = items.findIndex((it) => it.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const next = [...items];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    const reordered: Item[] = next.map((it, i) => ({ ...it, sort_order: i }));
    setItems(reordered);

    await Promise.all(
      reordered.map((it) =>
        fetch(`${endpoint}/${it.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(it),
        })
      )
    );
  }

  const isEditing = editingId !== null;

  return (
    <div>
      <div className="space-y-3">
        {items.length === 0 && !isEditing && (
          <p className="font-body text-sm text-dim">Belum ada data. Tambahkan item pertama.</p>
        )}
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 rounded-sm border border-hairline bg-panel2/50 p-4"
          >
            <div className="min-w-0">
              <p className="font-display text-sm font-medium text-primary truncate">
                {itemTitle(item)}
              </p>
              {itemSubtitle && (
                <p className="mt-0.5 font-body text-xs text-muted truncate">
                  {itemSubtitle(item)}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <IconBtn label="Naik" disabled={idx === 0} onClick={() => move(Number(item.id), -1)}>
                ↑
              </IconBtn>
              <IconBtn label="Turun" disabled={idx === items.length - 1} onClick={() => move(Number(item.id), 1)}>
                ↓
              </IconBtn>
              <IconBtn label="Edit" onClick={() => startEdit(item)}>
                Edit
              </IconBtn>
              <IconBtn label="Hapus" danger onClick={() => remove(Number(item.id))}>
                Hapus
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      {!isEditing && (
        <button
          onClick={startNew}
          className="mt-4 rounded-sm border border-dashed border-hairline px-4 py-2.5 font-display text-xs tracking-wide text-muted hover:border-teal hover:text-teal transition-colors"
        >
          + TAMBAH ITEM
        </button>
      )}

      {isEditing && (
        <div className="mt-4 rounded-sm border border-teal/40 bg-panel2/60 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block font-display text-[10px] tracking-[0.15em] text-dim">
                  {f.label.toUpperCase()}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={String(draft[f.key] ?? "")}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    rows={4}
                    className="mt-1.5 w-full rounded-sm border border-hairline bg-bg px-3 py-2 font-body text-sm text-primary outline-none focus:border-teal"
                  />
                ) : (
                  <input
                    type="text"
                    value={String(draft[f.key] ?? "")}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="mt-1.5 w-full rounded-sm border border-hairline bg-bg px-3 py-2 font-body text-sm text-primary outline-none focus:border-teal"
                  />
                )}
                {f.hint && <p className="mt-1 font-body text-[11px] text-dim">{f.hint}</p>}
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-sm bg-teal px-4 py-2 font-display text-xs font-semibold tracking-wide text-bg hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "MENYIMPAN..." : "SIMPAN"}
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-sm border border-hairline px-4 py-2 font-display text-xs tracking-wide text-muted hover:text-primary"
            >
              BATAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`rounded-sm border border-hairline px-2 py-1 font-display text-[10px] tracking-wide transition-colors disabled:opacity-30 ${
        danger ? "text-red hover:border-red" : "text-muted hover:border-teal hover:text-teal"
      }`}
    >
      {children}
    </button>
  );
}
