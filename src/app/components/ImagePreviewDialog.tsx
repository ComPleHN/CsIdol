"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";

interface ImagePreviewDialogProps {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

/** 图片大图预览弹窗，支持左右翻页 */
export default function ImagePreviewDialog({
  items,
  activeIndex,
  onClose,
  onChange,
}: ImagePreviewDialogProps) {
  const item = items[activeIndex];
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  const goPrev = () => hasPrev && onChange(activeIndex - 1);
  const goNext = () => hasNext && onChange(activeIndex + 1);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl border-border bg-card p-0">
        <DialogTitle className="sr-only">{item.title}</DialogTitle>

        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg bg-black">
          <Image src={item.src} alt={item.title} fill className="object-contain" priority />

          {hasPrev && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
              onClick={goPrev}
              aria-label="上一张"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full"
              onClick={goNext}
              aria-label="下一张"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between px-6 pb-5 pt-2">
          <div>
            <p className="text-xs text-primary">{item.category}</p>
            <p className="font-semibold">{item.title}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeIndex + 1} / {items.length}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
