import type { ConformanceSubmission, ControlCheck, RegisterItem } from '@adha/services';
import type { PortalRoute } from './routes';

export type PortalSummary = {
  actionRequired: number;
  highRisk: number;
  ready: number;
};

export type PortalState = {
  addEvidence: () => void;
  isSubmitting: boolean;
  navigate: (route: PortalRoute) => void;
  notice: string;
  refreshRegister: () => Promise<void>;
  register: RegisterItem[];
  route: PortalRoute;
  submission: ConformanceSubmission;
  submitEvidence: () => Promise<void>;
  summary: PortalSummary;
  updateCheck: (id: string, status: ControlCheck['status']) => void;
  updateField: (field: keyof ConformanceSubmission, value: string) => void;
};
