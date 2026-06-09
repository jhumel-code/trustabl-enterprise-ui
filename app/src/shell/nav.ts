export interface NavItem {
  label: string
  to: string
}
export interface NavGroup {
  heading?: string
  items: NavItem[]
}

// Sidebar groups — from ../../information-architecture.md.
export const NAV: NavGroup[] = [
  {
    items: [
      { label: 'Overview', to: '/' },
      { label: 'Repositories', to: '/repos' },
      { label: 'Findings', to: '/findings' },
      { label: 'Surfaces & Inventory', to: '/inventory' },
    ],
  },
  {
    heading: 'Governance',
    items: [
      { label: 'Policy', to: '/policy' },
      { label: 'Waivers', to: '/waivers' },
      { label: 'Compliance', to: '/compliance' },
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Integrations', to: '/settings/integrations' },
      { label: 'Rule packs', to: '/settings/rules' },
      { label: 'Members', to: '/settings/members' },
      { label: 'Audit log', to: '/settings/audit' },
      { label: 'Organization', to: '/settings/organization' },
      { label: 'License', to: '/settings/license' },
    ],
  },
]
