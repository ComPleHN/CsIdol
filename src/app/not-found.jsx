"use client";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:py-32">
      <p className="text-6xl font-bold text-cs-accent sm:text-8xl">404</p>
      <h1 className="mt-4 text-xl font-semibold uppercase tracking-wide text-cs-text sm:text-2xl">
        Round Lost — Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-cs-muted">
        你访问的页面不存在。可能是路由错误或已被移除。
      </p>
      <a
        href="./"
        className="mt-8 inline-flex bg-cs-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-cs-dark transition hover:bg-cs-accent-dim"
      >
        返回首页
      </a>
    </div>
  );
}
