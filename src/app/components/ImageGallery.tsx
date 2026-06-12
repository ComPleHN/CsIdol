"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/app/types";
import ImagePreviewDialog from "@/app/components/ImagePreviewDialog";

interface ImageGalleryProps {
  items: GalleryItem[];
}

/** 图集网格布局，点击打开预览弹窗 */
export default function ImageGallery({ items }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary text-left transition hover:border-primary/50"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs text-primary">{item.category}</p>
              <p className="text-sm font-medium text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <ImagePreviewDialog
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </>
  );
}
