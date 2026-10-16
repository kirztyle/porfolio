"use client";

import { useRef } from "react";

export type TabItem = { id: string | number; label: string };

/**
 * Tablist aksesibel (WAI-ARIA): roving tabindex, panah kiri/kanan, Home/End.
 * Panel dirender oleh parent; gunakan `tabId` / `panelId` untuk aria-controls.
 */
export const tabId = (prefix: string, id: string | number) => `${prefix}-tab-${id}`;
export const panelId = (prefix: string, id: string | number) => `${prefix}-panel-${id}`;

export default function TabList({
  items,
  activeId,
  onSelect,
  label,
  idPrefix,
}: {
  items: TabItem[];
  activeId: string | number;
  onSelect: (id: string | number) => void;
  label: string;
  idPrefix: string;
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const target = items[next];
    onSelect(target.id);
    refs.current[String(target.id)]?.focus();
  }

  const wrapper =
    "flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:thin] dark:border-slate-700";

  return (
    <div role="tablist" aria-label={label} className={wrapper}>
      {items.map((item, i) => {
        const active = item.id === activeId;
        const cls = `-mb-px shrink-0 border-b-2 px-4 py-2.5 font-display text-xs font-semibold tracking-wide transition-colors ${
          active
            ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
            : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[String(item.id)] = el;
            }}
            type="button"
            role="tab"
            id={tabId(idPrefix, item.id)}
            aria-selected={active}
            aria-controls={panelId(idPrefix, item.id)}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cls}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
