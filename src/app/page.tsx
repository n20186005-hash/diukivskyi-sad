import { redirect } from 'next/navigation';

// This page only renders when the app is built statically (output: 'export')
// For dynamic deployments, the middleware will intercept requests to `/`
// and redirect to the default locale (e.g. `/ru`).
// On static hosts (Cloudflare Pages) the edge redirect in `public/_redirects`
// handles `/` -> `/ru/` before this page is ever served, avoiding the
// client-side "Redirecting..." flash.
export default function RootPage() {
  redirect('/ru');
}