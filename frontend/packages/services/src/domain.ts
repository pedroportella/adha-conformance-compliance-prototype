export type WorkflowStatus =
  | 'Draft evidence'
  | 'Submitted'
  | 'Under assessment'
  | 'Action required'
  | 'Ready for approval';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface EvidenceDocument {
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  url?: string;
}

export interface ControlCheck {
  id: string;
  label: string;
  category: 'Accessibility' | 'Cyber security' | 'Analytics' | 'Integration';
  status: 'Complete' | 'Needs evidence' | 'Not started';
}

export interface ConformanceSubmission {
  id?: string;
  referenceNumber?: string;
  organisationName: string;
  contactName: string;
  contactEmail: string;
  productName: string;
  productVersion: string;
  conformanceProfile: string;
  integrationType: string;
  workflowStatus: WorkflowStatus;
  riskLevel: RiskLevel;
  targetReleaseDate: string;
  standards: string[];
  controlChecks: ControlCheck[];
  evidenceDocuments: EvidenceDocument[];
  submittedAt?: string;
}

export interface RegisterItem {
  id: string;
  referenceNumber: string;
  organisationName: string;
  productName: string;
  workflowStatus: WorkflowStatus;
  riskLevel: RiskLevel;
  submittedAt: string | null;
}

export const initialControlChecks: ControlCheck[] = [
  {
    id: 'wcag',
    label: 'WCAG 2.1 AA evidence supplied for user-facing screens',
    category: 'Accessibility',
    status: 'Needs evidence',
  },
  {
    id: 'auth',
    label: 'Authentication, authorisation and audit approach documented',
    category: 'Cyber security',
    status: 'Needs evidence',
  },
  {
    id: 'api',
    label: 'API error handling, retry behaviour and monitoring described',
    category: 'Integration',
    status: 'Not started',
  },
  {
    id: 'analytics',
    label: 'GTM/GA event plan maps to the conformance journey',
    category: 'Analytics',
    status: 'Not started',
  },
];

export const seedSubmissions: RegisterItem[] = [
  {
    id: 'adha-2026-001',
    referenceNumber: 'ADHA-CONF-2026-001',
    organisationName: 'River City Health Software',
    productName: 'Clinical Connect Gateway',
    workflowStatus: 'Under assessment',
    riskLevel: 'High',
    submittedAt: '2026-05-17T23:45:00+10:00',
  },
  {
    id: 'adha-2026-002',
    referenceNumber: 'ADHA-CONF-2026-002',
    organisationName: 'North Coast Primary Care Network',
    productName: 'Provider Readiness Portal',
    workflowStatus: 'Action required',
    riskLevel: 'Medium',
    submittedAt: '2026-05-16T13:10:00+10:00',
  },
  {
    id: 'adha-2026-003',
    referenceNumber: 'ADHA-CONF-2026-003',
    organisationName: 'Metro Pharmacy Systems',
    productName: 'ePrescribe Relay',
    workflowStatus: 'Ready for approval',
    riskLevel: 'Low',
    submittedAt: '2026-05-15T09:20:00+10:00',
  },
];

export const blankSubmission: ConformanceSubmission = {
  organisationName: 'Brisbane Digital Health Cooperative',
  contactName: 'Ava Martin',
  contactEmail: 'ava.martin@example.org.au',
  productName: 'Shared Care Connector',
  productVersion: '2.4.0',
  conformanceProfile: 'My Health Record B2B integration',
  integrationType: 'FHIR API and secure messaging',
  workflowStatus: 'Draft evidence',
  riskLevel: 'Medium',
  targetReleaseDate: '2026-07-01',
  standards: ['HL7 FHIR AU Core', 'Healthcare Identifiers', 'WCAG 2.1 AA'],
  controlChecks: initialControlChecks,
  evidenceDocuments: [],
};
