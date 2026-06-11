"use client";

export default function PageHeader({ tag, title, description }) {
  return (
    <div className="mb-8 border-l-4 border-cs-accent pl-4 sm:mb-12 sm:pl-6">
      {tag && (
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.25em] text-cs-accent">
          {tag}
        </p>
      )}
      <h1 className="text-2xl font-bold uppercase tracking-wide text-cs-text sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cs-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
