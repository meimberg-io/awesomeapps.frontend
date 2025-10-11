import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    strapiJwt?: string
    memberId?: number
    memberData?: any
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    strapiJwt?: string
    memberId?: number
    memberData?: any
  }
}

