export function Topbar({ title }: { title: string }) {
  return (
    <header className="topbar-layout">
      <h1 className="text-[--text-heading-sm] font-semibold text-[--color-foreground]">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-[--color-subtle] text-[--text-label-sm]">
          Radar prêt
        </span>
        <button className="rounded-full bg-[--color-foreground] text-[--color-foreground-inverse] px-4 py-2 text-[--text-label-md] font-medium transition-colors duration-150 hover:bg-[--color-primary-strong] hover:text-[--color-foreground]">
          Lancer un radar
        </button>
      </div>
    </header>
  );
}