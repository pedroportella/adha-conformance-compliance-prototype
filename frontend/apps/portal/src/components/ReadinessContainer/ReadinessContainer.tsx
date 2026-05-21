import type { ControlCheck } from '@adha/services';
import { calculateReadinessScore, getOutstandingCategories } from '@adha/services';
import { Field, MetricCard, Panel, SelectInput, Tags } from '@adha/ui-library';
import type { PortalState } from '../../app/portalState';

const controlStatuses: ControlCheck['status'][] = [
  'Not started',
  'Needs evidence',
  'Complete',
];

function countChecks(checks: ControlCheck[], status: ControlCheck['status']): number {
  return checks.filter((check) => check.status === status).length;
}

type ReadinessContainerProps = Pick<PortalState, 'submission' | 'updateCheck'>;

export function ReadinessContainer({ submission, updateCheck }: ReadinessContainerProps) {
  const readinessScore = calculateReadinessScore(submission);
  const outstandingCategories = getOutstandingCategories(submission.controlChecks);

  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="readiness-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Assessment readiness</p>
            <h2 id="readiness-heading">Evidence quality and risk controls</h2>
            <p>Use these readiness views before a submission moves into formal assessment, approval preparation or action-required correspondence.</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <div className="row portal-metrics" aria-label="Readiness summary">
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Readiness score" value={`${readinessScore}%`} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Complete checks" value={countChecks(submission.controlChecks, 'Complete')} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Need evidence" value={countChecks(submission.controlChecks, 'Needs evidence')} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Documents" value={submission.evidenceDocuments.length} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Readiness pages">
        <div className="row">
          <div className="col-xs-12 col-lg-7">
            <Panel id="readiness-controls" title="Control readiness" eyebrow="Assessment readiness page">
              <div className="readiness-summary">
                <Field label="Outstanding categories" inline>
                  {outstandingCategories.length > 0 ? <Tags items={outstandingCategories} /> : 'None'}
                </Field>
              </div>
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
          </div>
          <div className="col-xs-12 col-lg-5 portal-aside">
            <Panel id="readiness-evidence" title="Evidence readiness" eyebrow="Assessment readiness page">
              <ul className="portal-checklist">
                <li>Submission has a named product, owner and target release.</li>
                <li>Evidence maps to the selected conformance profile and integration type.</li>
                <li>Accessibility, cyber, analytics and integration controls are either complete or marked for action.</li>
              </ul>
            </Panel>
            <Panel id="readiness-decisioning" title="Decision readiness" eyebrow="Assessment readiness page">
              <ul className="portal-checklist">
                <li>Risk level supports triage priority and approval pathway.</li>
                <li>Outstanding evidence categories can be converted into clear action-required requests.</li>
                <li>Assessment notes are ready to move into the conformance register.</li>
              </ul>
            </Panel>
          </div>
        </div>
      </section>
    </>
  );
}
