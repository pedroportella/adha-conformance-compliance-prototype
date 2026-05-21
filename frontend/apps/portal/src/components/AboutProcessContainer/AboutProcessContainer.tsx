import { Panel } from '@adha/ui-library';

const processStages = [
  {
    title: 'Intake',
    body: 'A vendor or provider submits product, contact, integration and evidence metadata in a consistent structure.',
  },
  {
    title: 'Triage',
    body: 'The submission is placed on the conformance register with workflow status, risk level and assessment priority.',
  },
  {
    title: 'Readiness review',
    body: 'Assessment teams check evidence completeness across accessibility, cyber security, analytics and integration controls.',
  },
  {
    title: 'Assessment decision',
    body: 'Complete submissions proceed toward approval, while incomplete submissions are returned with action-required evidence requests.',
  },
];

export function AboutProcessContainer() {
  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="about-heading">
        <div className="row">
          <div className="col-xs-12 col-lg-8">
            <p className="eyebrow">About us</p>
            <h2 id="about-heading">Conformance and compliance information architecture</h2>
            <p>
              This portal organises ADHA-facing conformance work around the information needed to receive, assess and progress vendor or provider submissions. It separates submission intake, assessment readiness and register decisioning so each audience can work from the same record without duplicating evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Process architecture">
        <div className="row">
          <div className="col-xs-12 col-lg-7">
            <Panel id="process-model" title="Process model" eyebrow="Information architecture">
              <ol className="portal-process-list">
                {processStages.map((stage) => (
                  <li key={stage.title}>
                    <strong>{stage.title}</strong>
                    <span>{stage.body}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
          <div className="col-xs-12 col-lg-5 portal-aside">
            <Panel id="content-model" title="Content model" eyebrow="Information architecture">
              <ul className="portal-checklist">
                <li>Register item: reference, organisation, product, workflow status, risk and submission date.</li>
                <li>Submission record: ownership, conformance profile, integration type, standards and evidence documents.</li>
                <li>Readiness record: control category, evidence status and outstanding assessment categories.</li>
              </ul>
            </Panel>
            <Panel id="audience-model" title="Audience model" eyebrow="Information architecture">
              <ul className="portal-checklist">
                <li>Vendors and providers maintain submission and evidence information.</li>
                <li>Assessors manage readiness checks, risk triage and action-required outcomes.</li>
                <li>Approvers review register status and decision-ready submissions.</li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
