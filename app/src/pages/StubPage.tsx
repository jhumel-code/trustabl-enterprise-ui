import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'

/** Placeholder for a route defined in information-architecture.md but not yet built. */
export function StubPage({ title, summary }: { title: string; summary?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} subtitle={summary} />
      <Card className="p-8 text-center text-fg-muted">
        <div className="text-sm">This screen is scaffolded but not yet built.</div>
        <div className="mt-1 text-xs text-fg-subtle">
          Defined in <code className="font-mono">information-architecture.md</code> · build it in{' '}
          <code className="font-mono">src/pages</code>.
        </div>
      </Card>
    </div>
  )
}
