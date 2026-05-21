import type { NavLink } from '@adha/ui-library';

export type PortalRoute = 'register' | 'assessment-readiness' | 'vendor-provider-submission' | 'about-us';

export const PORTAL_ROUTES: Array<NavLink & { route: PortalRoute }> = [
  { href: '#register', label: 'Register', route: 'register' },
  { href: '#assessment-readiness', label: 'Assessment readiness', route: 'assessment-readiness' },
  { href: '#vendor-provider-submission', label: 'Vendor/provider submission', route: 'vendor-provider-submission' },
  { href: '#about-us', label: 'About us', route: 'about-us' },
];

export function getRouteFromHash(hash: string): PortalRoute {
  const normalized = hash.replace(/^#\/?/, '');
  const match = PORTAL_ROUTES.find((route) => route.route === normalized);

  return match?.route ?? 'register';
}
