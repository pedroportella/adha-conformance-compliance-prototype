import { MetricCard, Panel, Table, Tags } from '@adha/ui-library';
import { formatDate } from '@adha/utils';
import type { PortalState } from '../../app/portalState';

type RegisterContainerProps = Pick<PortalState, 'notice' | 'register' | 'summary'>;

export function RegisterContainer({ notice, register, summary }: RegisterContainerProps) {
  return (
    <>
      <section className="portal-band portal-band--summary" aria-labelledby="summary-heading">
        <div className="row">
          <div className="col-xs-12 col-md-4">
            <p className="eyebrow">Runtime status</p>
            <h2 id="summary-heading">Assessment queue</h2>
            <p>{notice}</p>
          </div>
          <div className="col-xs-12 col-md-8">
            <div className="row portal-metrics" aria-label="Conformance summary">
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Total submissions" value={register.length} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="High risk" value={summary.highRisk} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Action required" value={summary.actionRequired} />
              </div>
              <div className="col-xs-12 col-sm-6 col-lg-3">
                <MetricCard label="Ready" value={summary.ready} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="portal-band" aria-label="Conformance register and assessment priorities">
        <div className="row">
          <div className="col-xs-12 col-lg-8">
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
          </div>
          <aside className="col-xs-12 col-lg-4 portal-aside" aria-label="Assessment priorities">
            <section className="portal-priority">
              <p className="eyebrow">Priority work</p>
              <h2>Focus the assessment team</h2>
              <ul className="au-link-list portal-priority__list">
                <li><a href="#vendor-provider-submission">Capture missing vendor evidence</a></li>
                <li><a href="#assessment-readiness">Check accessibility and cyber controls</a></li>
                <li><a href="#register">Review high-risk submissions first</a></li>
              </ul>
            </section>
            <section className="portal-priority portal-priority--teal">
              <p className="eyebrow">Operating principle</p>
              <h2>One record, several decisions</h2>
              <p>Register data, evidence quality, risk triage and approval readiness are treated as related views of the same submission lifecycle.</p>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
