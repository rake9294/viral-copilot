export default function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-[--text-heading-md] font-semibold">Paramètres</h2>
      <div className="card-signal bg-[--color-surface] border border-[--color-border-soft] space-y-4">
        <div>
          <h3 className="text-[--text-title-md] font-medium">Sources connectées</h3>
          <p className="text-[--text-body-sm] text-[--color-muted] mt-1">TrendTrack MCP · Statut : disponible</p>
        </div>
        <div className="h-px bg-[--color-border-soft]" />
        <div>
          <h3 className="text-[--text-title-md] font-medium">Modèle LLM</h3>
          <p className="text-[--text-body-sm] text-[--color-muted] mt-1">deepseek/deepseek-v4-flash — Fallback configuré</p>
        </div>
        <div className="h-px bg-[--color-border-soft]" />
        <div>
          <h3 className="text-[--text-title-md] font-medium">Budget par run</h3>
          <p className="text-[--text-body-sm] text-[--color-muted] mt-1">$5.00 max LLM · 500 appels max · 30 min timeout</p>
        </div>
      </div>
    </div>
  );
}