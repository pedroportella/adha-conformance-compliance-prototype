import { useMemo, useState } from 'react';
import {
  blankSubmission,
  createSubmission,
  seedSubmissions,
  listSubmissions,
  type ConformanceSubmission,
  type ControlCheck,
  type EvidenceDocument,
  type RegisterItem,
  type WorkflowStatus,
} from '@adha/services';
import {
  Button,
  Field,
  Form,
  FormActions,
  Layout,
  MetricCard,
  Panel,
  SelectInput,
  Table,
  Tags,
  TextInput,
} from '@adha/ui-library';
import { formatDate } from '@adha/utils';

const workflowStatuses: WorkflowStatus[] = [
  'Draft evidence',
  'Submitted',
  'Under assessment',
  'Action required',
  'Ready for approval',
];

const conformanceProfiles = [
  'My Health Record B2B integration',
  'Electronic prescribing integration',
  'Healthcare Identifiers service',
  'Secure messaging integration',
];

const controlStatuses: ControlCheck['status'][] = [
  'Not started',
  'Needs evidence',
  'Complete',
];

function countChecks(checks: ControlCheck[], status: ControlCheck['status']): number {
  return checks.filter((check) => check.status === status).length;
}

export function App() {
  const [submission, setSubmission] = useState<ConformanceSubmission>(blankSubmission);
  const [register, setRegister] = useState<RegisterItem[]>(seedSubmissions);
  const [notice, setNotice] = useState('Prototype is using seeded data until the Drupal API is available.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const summary = useMemo(() => {
    const highRisk = register.filter((item) => item.riskLevel === 'High').length;
    const actionRequired = register.filter((item) => item.workflowStatus === 'Action required').length;
    const ready = register.filter((item) => item.workflowStatus === 'Ready for approval').length;

    return { highRisk, actionRequired, ready };
  }, [register]);

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
      setNotice('Drupal API unavailable; showing seeded conformance submissions for the prototype.');
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
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout
      links={[
        { href: '#register', label: 'Register' },
        { href: '#submission', label: 'Submission' },
        { href: '#readiness', label: 'Readiness' },
      ]}
      footer={{
        copyright: '© Commonwealth of Australia. ADHA conformance and compliance prototype.',
        sections: [
          {
            content: 'The ADHA conformance and compliance prototype acknowledges Aboriginal and Torres Strait Islander peoples as the Traditional Owners and Custodians of Country. We recognise their continuing connection to land, waters, culture and community, and the importance of genuine partnership in designing safer, more inclusive digital health services.',
          },
          {
            ariaLabel: 'Prototype footer links',
            links: [
              { href: '#register', label: 'Conformance register' },
              { href: '#submission', label: 'Evidence intake' },
              { href: '#readiness', label: 'Assessment readiness' },
              { href: '#accessibility', label: 'Accessibility statement' },
              { href: '#privacy', label: 'Privacy and evidence handling' },
              { href: '#disclaimer', label: 'Prototype disclaimer' },
            ],
            title: 'Using this prototype',
          },
          {
            action: { href: '#submission', label: 'Provide feedback' },
            content: 'This prototype is being refined to test vendor submissions, assessment triage, evidence quality and readiness controls before a production GovCMS and Drupal implementation.',
            title: 'Help us improve',
          },
        ],
      }}
      subHeader={{
        introduction: 'A working prototype for ADHA-style vendor and provider submissions covering integration evidence, accessibility, cyber controls, analytics readiness and Agency assessment workflow.',
        title: 'Conformance evidence, workflow triage and digital health readiness in one operating view.',
        children: (
          <div className="portal-sub-header__actions">
            <Button href="#submission">Create submission</Button>
            <Button className="au-btn--dark" variant="secondary" type="button" onClick={refreshRegister}>Refresh register</Button>
          </div>
        ),
      }}
    >
      <Panel title="Assessment queue" eyebrow="Runtime status">
        <Field label="Status">{notice}</Field>
      </Panel>

      <Panel title="Conformance summary" eyebrow="Register metrics">
        <MetricCard label="Total submissions" value={register.length} />
        <MetricCard label="High risk" value={summary.highRisk} />
        <MetricCard label="Action required" value={summary.actionRequired} />
        <MetricCard label="Ready" value={summary.ready} />
      </Panel>

      <Panel id="register" title="Conformance register" eyebrow="Workflow triage" wide>
        <Table
          headers={['Reference', 'Organisation', 'Product', 'Status', 'Risk', 'Submitted']}
          rows={register.map((item) => [
            item.referenceNumber,
            item.organisationName,
            item.productName,
            <Tags items={[item.workflowStatus]} />,
            <Tags tone={item.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'} items={[item.riskLevel]} />,
            formatDate(item.submittedAt),
          ])}
        />
      </Panel>

      <Panel id="submission" title="Evidence intake" eyebrow="Vendor/provider submission">
        <Form onSubmit={submitEvidence}>
          <TextInput id="organisation" label="Organisation" value={submission.organisationName} onChange={(event) => updateField('organisationName', event.target.value)} />
          <TextInput id="product" label="Product" value={submission.productName} onChange={(event) => updateField('productName', event.target.value)} />
          <TextInput id="contact-email" label="Contact email" type="email" value={submission.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} />
          <SelectInput id="conformance-profile" label="Conformance profile" options={conformanceProfiles} value={submission.conformanceProfile} onChange={(event) => updateField('conformanceProfile', event.target.value)} />
          <SelectInput id="workflow-status" label="Workflow status" options={workflowStatuses} value={submission.workflowStatus} onChange={(event) => updateField('workflowStatus', event.target.value)} />
          <TextInput id="target-release" label="Target release" type="date" value={submission.targetReleaseDate} onChange={(event) => updateField('targetReleaseDate', event.target.value)} />
          <Field label="Evidence" inline>{submission.evidenceDocuments.length} documents attached</Field>
          <FormActions>
            <Button variant="secondary" type="button" onClick={addEvidence}>Attach sample evidence</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit to conformance register'}</Button>
          </FormActions>
        </Form>
      </Panel>

      <Panel id="readiness" title="Assessment readiness" eyebrow="Controls">
        <Field label="Complete">{countChecks(submission.controlChecks, 'Complete')}</Field>
        <Field label="Need evidence">{countChecks(submission.controlChecks, 'Needs evidence')}</Field>
        {submission.controlChecks.map((check) => (
          <SelectInput
            key={check.id}
            id={`control-${check.id}`}
            label={`${check.category}: ${check.label}`}
            options={controlStatuses}
            value={check.status}
            onChange={(event) => updateCheck(check.id, event.target.value as ControlCheck['status'])}
          />
        ))}
      </Panel>
    </Layout>
  );
}
