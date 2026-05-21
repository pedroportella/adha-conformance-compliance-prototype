import { useEffect, useMemo, useState } from 'react';
import {
  blankSubmission,
  createSubmission,
  listSubmissions,
  seedSubmissions,
  type ConformanceSubmission,
  type ControlCheck,
  type EvidenceDocument,
  type RegisterItem,
} from '@adha/services';
import { Button, Layout } from '@adha/ui-library';
import { AboutUsPage, AssessmentReadinessPage, RegisterPage, VendorProviderSubmissionPage } from './pages';
import type { PortalRoute } from './routes';
import { getRouteFromHash, PORTAL_ROUTES } from './routes';

export function App() {
  const [route, setRoute] = useState<PortalRoute>(() => getRouteFromHash(window.location.hash));
  const [submission, setSubmission] = useState<ConformanceSubmission>(blankSubmission);
  const [register, setRegister] = useState<RegisterItem[]>(seedSubmissions);
  const [notice, setNotice] = useState('Prototype is using seeded data until the Drupal API is available.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash(window.location.hash));

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const summary = useMemo(() => {
    const highRisk = register.filter((item) => item.riskLevel === 'High').length;
    const actionRequired = register.filter((item) => item.workflowStatus === 'Action required').length;
    const ready = register.filter((item) => item.workflowStatus === 'Ready for approval').length;

    return { highRisk, actionRequired, ready };
  }, [register]);

  const navigate = (nextRoute: PortalRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
  };

  const updateField = (field: keyof ConformanceSubmission, value: string) => {
    setSubmission((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateCheck = (id: string, status: ControlCheck['status']) => {
    setSubmission((current) => ({
      ...current,
      controlChecks: current.controlChecks.map((check) => (
        check.id === id ? { ...check, status } : check
      )),
    }));
  };

  const addEvidence = () => {
    const document: EvidenceDocument = {
      fileId: `local-${Date.now()}`,
      fileName: `conformance-evidence-${submission.evidenceDocuments.length + 1}.pdf`,
      fileType: 'application/pdf',
      fileSize: 428000,
      uploadedAt: new Date().toISOString(),
    };

    setSubmission((current) => ({
      ...current,
      evidenceDocuments: [...current.evidenceDocuments, document],
    }));
  };

  const refreshRegister = async () => {
    try {
      const items = await listSubmissions();
      setRegister(items.length > 0 ? items : seedSubmissions);
      setNotice('Loaded conformance submissions from the Drupal API.');
    }
    catch {
      setRegister(seedSubmissions);
      setNotice('Drupal API unavailable; showing seeded conformance submissions for local review.');
    }
  };

  const submitEvidence = async () => {
    setIsSubmitting(true);

    try {
      const created = await createSubmission({
        ...submission,
        workflowStatus: 'Submitted',
      });
      const registerItem: RegisterItem = {
        id: created.id ?? `local-${Date.now()}`,
        referenceNumber: created.referenceNumber ?? 'ADHA-CONF-DRAFT',
        organisationName: created.organisationName,
        productName: created.productName,
        workflowStatus: created.workflowStatus,
        riskLevel: created.riskLevel,
        submittedAt: created.submittedAt ?? new Date().toISOString(),
      };

      setRegister((current) => [registerItem, ...current]);
      setNotice('Submission sent to the Drupal conformance register.');
      navigate('register');
    }
    catch {
      const fallbackItem: RegisterItem = {
        id: `local-${Date.now()}`,
        referenceNumber: `ADHA-CONF-${new Date().getFullYear()}-DRAFT`,
        organisationName: submission.organisationName,
        productName: submission.productName,
        workflowStatus: 'Submitted',
        riskLevel: submission.riskLevel,
        submittedAt: new Date().toISOString(),
      };

      setRegister((current) => [fallbackItem, ...current]);
      setNotice('Submission captured locally; Drupal API can persist it when the backend is running.');
      navigate('register');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const renderPage = () => {
    switch (route) {
      case 'assessment-readiness':
        return <AssessmentReadinessPage submission={submission} updateCheck={updateCheck} />;
      case 'vendor-provider-submission':
        return (
          <VendorProviderSubmissionPage
            addEvidence={addEvidence}
            isSubmitting={isSubmitting}
            notice={notice}
            submission={submission}
            submitEvidence={submitEvidence}
            updateField={updateField}
          />
        );
      case 'about-us':
        return <AboutUsPage />;
      case 'register':
      default:
        return <RegisterPage notice={notice} register={register} summary={summary} />;
    }
  };

  return (
    <Layout
      links={PORTAL_ROUTES}
      footer={{
        copyright: '© Commonwealth of Australia. ADHA conformance and compliance portal.',
        sections: [
          {
            content: 'The ADHA conformance and compliance portal acknowledges Aboriginal and Torres Strait Islander peoples as the Traditional Owners and Custodians of Country. We recognise their continuing connection to land, waters, culture and community, and the importance of genuine partnership in designing safer, more inclusive digital health services.',
          },
          {
            ariaLabel: 'Portal footer links',
            links: PORTAL_ROUTES,
            title: 'Using this portal',
          },
          {
            action: { href: '#about-us', label: 'View process architecture' },
            content: 'This local implementation supports review of vendor submissions, assessment triage, evidence quality and readiness controls before production GovCMS and Drupal delivery.',
            title: 'Conformance process',
          },
        ],
      }}
      subHeader={{
        introduction: 'A working portal for ADHA-style vendor and provider submissions covering integration evidence, accessibility, cyber controls, analytics readiness and Agency assessment workflow.',
        title: 'Conformance evidence, workflow triage and digital health readiness in one operating view.',
        children: (
          <div className="portal-sub-header__actions">
            <Button route="#vendor-provider-submission" onNavigate={() => navigate('vendor-provider-submission')}>Create submission</Button>
            <Button className="au-btn--dark" variant="secondary" type="button" onClick={refreshRegister}>Refresh register</Button>
          </div>
        ),
      }}
    >
      {renderPage()}
    </Layout>
  );
}
