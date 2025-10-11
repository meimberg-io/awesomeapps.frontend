import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import AzureAD from "next-auth/providers/azure-ad"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.OAUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    }),
    AzureAD({
      clientId: process.env.OAUTH_AZURE_AD_CLIENT_ID,
      clientSecret: process.env.OAUTH_AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.OAUTH_AZURE_AD_TENANT_ID,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnProtectedRoute = nextUrl.pathname.startsWith("/protected")
      
      if (isOnProtectedRoute && !isLoggedIn) {
        return false
      }
      
      return true
    },
  },
  trustHost: true,
})

