import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold">页面不存在</h1>
      <p className="mt-2 text-sm text-muted-foreground">请检查 URL 或返回首页</p>
      <Button asChild className="mt-6">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
