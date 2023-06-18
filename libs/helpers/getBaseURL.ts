/**
 * Gets the base URL of the site.
 *
 * Will return the following in order of priority:
 * 1. NEXT_PUBLIC_VERCEL_URL environment variable - Set automatically by Vercel.
 * 2. NEXT_PUBLIC_BASE_WEB_URL environment variable.
 */
export const getBaseURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    process?.env?.NEXT_PUBLIC_BASE_WEB_URL!;
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};
