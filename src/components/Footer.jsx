"use client";

export default function Footer() {
  return (
    <footer className="border-t border-cs-border bg-cs-panel">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:text-left">
        <p className="text-xs uppercase tracking-widest text-cs-muted">
          © {new Date().getFullYear()} CS IDOL — Inspired by Counter-Strike 2
        </p>
        <p className="text-xs text-cs-muted">
          Deployed on <span className="text-cs-accent">GitHub Pages</span>
        </p>
      </div>
    </footer>
  );
}
