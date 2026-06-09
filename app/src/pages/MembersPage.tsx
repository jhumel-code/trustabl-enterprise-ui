import { members, roles } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'

type Member = (typeof members)[number]
type Role = (typeof roles)[number]

/** Members & roles (settings) — RBAC roster for the org's control plane. */
export function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Members & roles"
        subtitle={`${members.length} members`}
        actions={<Button variant="primary">Invite</Button>}
      />

      <Card className="p-0">
        <div className="border-b px-4 py-3 text-sm font-medium">Members</div>
        <div className="overflow-auto p-2">
          <DataTable<Member>
            rows={members}
            empty="No members."
            columns={[
              { header: 'Name', cell: (m) => <span className="font-medium">{m.name}</span> },
              {
                header: 'Email',
                cell: (m) => <span className="font-mono text-xs text-fg-muted">{m.email}</span>,
              },
              { header: 'Role', cell: (m) => <Badge>{m.role}</Badge> },
              {
                header: 'SSO',
                className: 'text-right',
                cell: (m) =>
                  m.sso ? (
                    <span className="text-status-success">✓ SSO</span>
                  ) : (
                    <span className="text-fg-subtle">local</span>
                  ),
              },
            ]}
          />
        </div>
      </Card>

      <Card className="p-0">
        <div className="border-b px-4 py-3 text-sm font-medium">Roles (RBAC)</div>
        <div className="overflow-auto p-2">
          <DataTable<Role>
            rows={roles}
            empty="No roles."
            columns={[
              { header: 'Role', cell: (r) => <span className="font-medium">{r.name}</span> },
              {
                header: 'Permissions',
                cell: (r) => (
                  <div className="flex flex-wrap gap-1.5">
                    {r.permissions.map((p) => (
                      <Badge key={p} tone="neutral">
                        <span className="font-mono text-xs">{p}</span>
                      </Badge>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  )
}
