import { player } from "@/app/data";
import ImageGallery from "@/app/components/ImageGallery";

/** 图集页：网格画廊 + 弹窗预览 */
export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 border-l-4 border-primary pl-4">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Gallery</p>
        <h1 className="mt-1 text-3xl font-bold">选手图集</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {player.nickname} 精彩瞬间 · 点击图片可放大并翻页浏览
        </p>
      </div>

      <ImageGallery items={player.gallery} />
    </div>
  );
}
