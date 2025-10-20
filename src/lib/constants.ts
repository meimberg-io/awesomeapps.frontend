// Use internal URL for server-side requests, public URL for client-side
export const STRAPI_BASEURL = typeof window === 'undefined'
  ? (process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_BASEURL)
  : process.env.NEXT_PUBLIC_STRAPI_BASEURL;

export const APP_BASEURL = process.env.NEXT_PUBLIC_APP_BASEURL || 'http://localhost:8203';