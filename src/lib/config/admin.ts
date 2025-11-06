const DEFAULT_ADMIN_EMAILS = ['oli@meimberg.io']

function getAdminEmails(): string[] {
  if (process.env.ADMIN_EMAILS) {
    return process.env.ADMIN_EMAILS.split(',').map(email => email.trim()).filter(Boolean)
  }
  return DEFAULT_ADMIN_EMAILS
}

export const ADMIN_EMAILS = getAdminEmails()

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

