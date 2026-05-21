import type { WorkflowStatus } from '@adha/services';
import { Button, Field, Form, FormActions, Panel, SelectInput, TextInput } from '@adha/ui-library';
import type { PortalState } from '../../app/portalState';

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

type SubmissionContainerProps = Pick<
  PortalState,
  'addEvidence' | 'isSubmitting' | 'notice' | 'submission' | 'submitEvidence' | 'updateField'
>;

export function SubmissionContainer({
  addEvidence,
  isSubmitting,
  notice,
  submission,
  submitEvidence,
  updateField,
}: SubmissionContainerProps) {
  return (
    <>
      <section className="portal-band portal-band--intake" aria-labelledby="submission-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Vendor/provider submission</p>
            <h2 id="submission-heading">Evidence intake and submission management</h2>
            <p>Capture the details assessment teams need before evidence moves into formal conformance review.</p>
            <p className="portal-status-note">{notice}</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <Panel id="submission" title="Create or update a submission" eyebrow="Vendor/provider submission page">
              <Form onSubmit={submitEvidence}>
                <TextInput id="organisation" label="Organisation" value={submission.organisationName} onChange={(event) => updateField('organisationName', event.target.value)} />
                <TextInput id="contact-name" label="Contact name" value={submission.contactName} onChange={(event) => updateField('contactName', event.target.value)} />
                <TextInput id="contact-email" label="Contact email" type="email" value={submission.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} />
                <TextInput id="product" label="Product" value={submission.productName} onChange={(event) => updateField('productName', event.target.value)} />
                <TextInput id="product-version" label="Product version" value={submission.productVersion} onChange={(event) => updateField('productVersion', event.target.value)} />
                <SelectInput id="conformance-profile" label="Conformance profile" options={conformanceProfiles} value={submission.conformanceProfile} onChange={(event) => updateField('conformanceProfile', event.target.value)} />
                <TextInput id="integration-type" label="Integration type" value={submission.integrationType} onChange={(event) => updateField('integrationType', event.target.value)} />
                <SelectInput id="workflow-status" label="Workflow status" options={workflowStatuses} value={submission.workflowStatus} onChange={(event) => updateField('workflowStatus', event.target.value)} />
                <TextInput id="target-release" label="Target release" type="date" value={submission.targetReleaseDate} onChange={(event) => updateField('targetReleaseDate', event.target.value)} />
                <Field label="Evidence" inline>{submission.evidenceDocuments.length} documents attached</Field>
                <FormActions>
                  <Button variant="secondary" type="button" onClick={addEvidence}>Attach sample evidence</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit to conformance register'}</Button>
                </FormActions>
              </Form>
            </Panel>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Submission pages">
        <div className="row portal-page-grid">
          <div className="col-xs-12 col-md-4">
            <Panel id="submission-profile" title="Profile and ownership" eyebrow="Vendor/provider submission page">
              <p>Identifies the organisation, product owner, contact point and applicable conformance profile.</p>
            </Panel>
          </div>
          <div className="col-xs-12 col-md-4">
            <Panel id="submission-evidence" title="Evidence package" eyebrow="Vendor/provider submission page">
              <p>Groups supporting documents against standards, controls and assessment questions.</p>
            </Panel>
          </div>
          <div className="col-xs-12 col-md-4">
            <Panel id="submission-register" title="Register handover" eyebrow="Vendor/provider submission page">
              <p>Creates the register item used by ADHA assessors for workflow status, risk and approval decisions.</p>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
