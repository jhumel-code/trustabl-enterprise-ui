/** Placeholder for a route defined in information-architecture.md but not yet built. */
export function StubPage({ title, summary }: { title: string; summary?: string }) {
  return (
    <div className="max-w-content">
      <h1 className="text-xl font-semibold">{title}</h1>
      {summary && <p className="mt-1 text-sm text-fg-muted">{summary}</p>}
      <div className="mt-6 rounded-lg border bg-surface p-8 text-center text-fg-muted">
        <div className="text-sm">This screen is scaffolded but not yet built.</div>
        <div className="mt-1 text-xs text-fg-subtle">
          Defined in <code className="font-mono">information-architecture.md</code> · build it in{' '}
          <code className="font-mono">src/pages</code>.
        </div>
      </div>
    </div>
  )
}
