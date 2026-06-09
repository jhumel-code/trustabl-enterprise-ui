import { useState } from 'react'
import { members as seedMembers, roles } from '@/data/platform'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DataTable } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

type Member = (typeof seedMembers)[number]
type Role = (typeof roles)[number]

/** Members & roles — RBAC roster with full user management (invite / edit / remove).
 *  Mutations are local state; wire to a control-plane API later. */
export function MembersPage() {
  const [members, setMembers] = useState<Member[]>(seedMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [removing, setRemoving] = useState<Member | null>(null)

  const roleNames = roles.map((r) => r.name)

  function addMember(m: Omit<Member, 'id'>) {
    setMembers((prev) => [...prev, { ...m, id: `u${prev.length + 1}-${m.email}` }])
  }
  function updateMember(id: string, patch: Partial<Member>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }
  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Members & roles"
        subtitle={`${members.length} members`}
        actions={
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            Invite
          </Button>
        }
      />

      <Card className="p-0">
        <div className="border-b px-4 py-3 text-sm font-medium">Members</div>
        <div className="overflow-auto p-2">
          <DataTable<Member>
            rows={members}
            empty="No members."
            columns={[
              { header: 'Name', cell: (m) => <span className="font-medium">{m.name}</span> },
              { header: 'Email', cell: (m) => <span className="font-mono text-xs text-fg-muted">{m.email}</span> },
              { header: 'Role', cell: (m) => <Badge>{m.role}</Badge> },
              {
                header: 'Auth',
                cell: (m) =>
                  m.sso ? <span className="text-status-success">✓ SSO</span> : <span className="text-fg-subtle">local</span>,
              },
              {
                header: '',
                className: 'text-right',
                cell: (m) => (
                  <span className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(m)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-status-danger" onClick={() => setRemoving(m)}>
                      Remove
                    </Button>
                  </span>
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

      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        roleNames={roleNames}
        onInvite={addMember}
      />
      {editing && (
        <EditMemberModal
          member={editing}
          onClose={() => setEditing(null)}
          roleNames={roleNames}
          onSave={updateMember}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        danger
        title="Remove member"
        confirmLabel="Remove"
        message={
          removing ? (
            <>
              Remove <b className="text-fg">{removing.name}</b> ({removing.email})? They lose access immediately.
            </>
          ) : null
        }
        onConfirm={() => removing && removeMember(removing.id)}
      />
    </div>
  )
}

function InviteMemberModal({
  open,
  onClose,
  roleNames,
  onInvite,
}: {
  open: boolean
  onClose: () => void
  roleNames: string[]
  onInvite: (m: { name: string; email: string; role: string; sso: boolean }) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(roleNames[0] ?? 'Developer')
  const [sso, setSso] = useState(true)
  const valid = name.trim() !== '' && /.+@.+\..+/.test(email)

  function submit() {
    if (!valid) return
    onInvite({ name: name.trim(), email: email.trim(), role, sso })
    setName('')
    setEmail('')
    setRole(roleNames[0] ?? 'Developer')
    setSso(true)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite member"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!valid} onClick={submit}>
            Send invite
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            {roleNames.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input type="checkbox" checked={sso} onChange={(e) => setSso(e.target.checked)} /> Provision via SSO
        </label>
      </div>
    </Modal>
  )
}

function EditMemberModal({
  member,
  onClose,
  roleNames,
  onSave,
}: {
  member: Member
  onClose: () => void
  roleNames: string[]
  onSave: (id: string, patch: Partial<Member>) => void
}) {
  const [role, setRole] = useState(member.role)
  const [sso, setSso] = useState(member.sso)

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit ${member.name}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onSave(member.id, { role, sso })
              onClose()
            }}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name">
          <Input value={member.name} disabled />
        </Field>
        <Field label="Email">
          <Input value={member.email} disabled />
        </Field>
        <Field label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            {roleNames.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-fg-muted">
          <input type="checkbox" checked={sso} onChange={(e) => setSso(e.target.checked)} /> Provisioned via SSO
        </label>
      </div>
    </Modal>
  )
}
