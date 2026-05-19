import type { ConformanceSubmission, EvidenceDocument, RegisterItem } from './domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export async function listSubmissions(): Promise<RegisterItem[]> {
  const response = await fetch(`${API_BASE_URL}/conformance-submissions`);

  if (!response.ok) {
    throw new Error('Unable to load the conformance register.');
  }

  return response.json() as Promise<RegisterItem[]>;
}

export async function createSubmission(payload: ConformanceSubmission): Promise<ConformanceSubmission> {
  const response = await fetch(`${API_BASE_URL}/conformance-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Unable to submit conformance evidence.');
  }

  return response.json() as Promise<ConformanceSubmission>;
}

export async function uploadEvidence(file: File): Promise<EvidenceDocument> {
  const body = new FormData();
  body.append('file', file);

  const response = await fetch(`${API_BASE_URL}/conformance-submissions/evidence`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('Unable to upload evidence document.');
  }

  return response.json() as Promise<EvidenceDocument>;
}
