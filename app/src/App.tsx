import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/shell/AppShell'
import { OverviewPage } from '@/pages/OverviewPage'
import { RepositoriesPage } from '@/pages/RepositoriesPage'
import { RepoOverviewPage } from '@/pages/RepoOverviewPage'
import { ScanOverview } from '@/pages/ScanOverview'
import { FindingsPage } from '@/pages/FindingsPage'
import { SurfaceDetailPage } from '@/pages/SurfaceDetailPage'
import { SkillDetailPage } from '@/pages/SkillDetailPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { PolicyPage } from '@/pages/PolicyPage'
import { WaiversPage } from '@/pages/WaiversPage'
import { CompliancePage } from '@/pages/CompliancePage'
import { IntegrationsPage } from '@/pages/IntegrationsPage'
import { RulePacksPage } from '@/pages/RulePacksPage'
import { MembersPage } from '@/pages/MembersPage'
import { AuditLogPage } from '@/pages/AuditLogPage'
import { OrganizationPage } from '@/pages/OrganizationPage'
import { LicensePage } from '@/pages/LicensePage'
import { LoginPage } from '@/pages/LoginPage'
import { StubPage } from '@/pages/StubPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/repos" element={<RepositoriesPage />} />
          <Route path="/repos/:repoId" element={<RepoOverviewPage />} />
          <Route path="/repos/:repoId/scans/:scanId" element={<ScanOverview />} />
          <Route
            path="/repos/:repoId/scans/:scanId/diff/:otherScanId"
            element={<StubPage title="Scan diff" summary="Compare two ScanIDs." />}
          />
          <Route path="/findings" element={<FindingsPage />} />
          <Route path="/findings/:findingId" element={<FindingsPage />} />
          <Route path="/surfaces/:surfaceId" element={<SurfaceDetailPage />} />
          <Route path="/skills/:skillId" element={<SkillDetailPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/waivers" element={<WaiversPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/settings/integrations" element={<IntegrationsPage />} />
          <Route path="/settings/rules" element={<RulePacksPage />} />
          <Route path="/settings/members" element={<MembersPage />} />
          <Route path="/settings/audit" element={<AuditLogPage />} />
          <Route path="/settings/organization" element={<OrganizationPage />} />
          <Route path="/settings/license" element={<LicensePage />} />
          <Route path="/onboarding" element={<StubPage title="Onboarding" summary="Connect SCM → discover repos → first scan → invite team." />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  )
}
