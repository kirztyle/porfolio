"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { dictionary, t, type Lang } from "@/lib/I18n";

/**
 * Carousel gambar manual (tombol, dot, panah keyboard, swipe), tanpa autoplay.
 * 1 gambar: tampil langsung tanpa kontrol. Parent memakai `key` untuk reset ke slide 0.
 */
export default function ImageCarousel({
  images,
  alt,
  lang,
}: {
  images: string[];
  alt: string;
  lang: Lang;
}) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = images.length;
  const current = Math.max(0, Math.min(index, count - 1));

  if (count === 0) return null;

  const go = (i: number) => setIndex(((i % count) + count) % count);

  function onKeyDown(e: React.KeyboardEvent) {
    if (count < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(current - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(current + 1);
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
  }

  const btn =
    "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-800 shadow ring-1 ring-slate-200 backdrop-blur transition-colors hover:bg-white dark:bg-slate-900/80 dark:text-slate-100 dark:ring-slate-700 dark:hover:bg-slate-900";

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={onTouchEnd}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        aria-live="polite"
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={i !== current}
            className="relative h-full w-full shrink-0"
          >
            <Image
              src={src}
              alt={`${alt} (${i + 1}/${count})`}
              fill
              sizes="(min-width: 896px) 832px, 100vw"
              className="object-contain p-2"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(current - 1)}
            aria-label={t(dictionary.projects.prev, lang)}
            className={`${btn} left-2`}
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(current + 1)}
            aria-label={t(dictionary.projects.next, lang)}
            className={`${btn} right-2`}
          >
            <Chevron dir="right" />
          </button>
          <div className="absolute inset-x-0 bottom-1 z-10 flex justify-center">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${t(dictionary.projects.goTo, lang)} ${i + 1}`}
                aria-current={i === current}
                className="flex h-6 w-5 items-center justify-center"
              >
                <span
                  className={`block h-2 rounded-full transition-all ${
                    i === current
                      ? "w-5 bg-blue-600 dark:bg-blue-400"
                      : "w-2 bg-slate-400/70 dark:bg-slate-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
