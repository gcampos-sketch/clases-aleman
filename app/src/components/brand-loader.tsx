export function BrandLoader({label = "Preparando tu alemán…"}: {label?: string}) {
  return <div className="brand-loading" role="status" aria-live="polite">
    <div className="brand-loading-orbit"><img src="/favicon.svg" alt="" width="64" height="64" /></div>
    <strong>Deutsch</strong><span>{label}</span>
    <div className="brand-loading-track" aria-hidden="true"><i /></div>
  </div>;
}
