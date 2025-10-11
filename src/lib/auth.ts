import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import AzureAD from "next-auth/providers/azure-ad"
import { STRAPI_BASEURL } from "@/lib/constants"

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
      issuer: `https://login.microsoftonline.com/${process.env.OAUTH_AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // After initial sign in, fetch Strapi JWT and member data
      if (account && profile) {
        try {
          const providerMap: Record<string, string> = {
            google: 'google',
            github: 'github',
            'azure-ad': 'azure-ad',
          };

          const response = await fetch(`${STRAPI_BASEURL}/api/members/me`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: profile.email || user.email,
              name: profile.name || user.name,
              picture: (profile as any).picture || (profile as any).avatar_url || user.image,
              provider: providerMap[account.provider] || 'google',
              sub: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.strapiJwt = data.jwt;
            token.memberId = data.member.id;
            token.memberData = data.member;
          }
        } catch (error) {
          console.error('Failed to authenticate with Strapi:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add Strapi data to session
      if (token.strapiJwt) {
        session.strapiJwt = token.strapiJwt as string;
        session.memberId = token.memberId as number;
        session.memberData = token.memberData as any;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnProtectedRoute = nextUrl.pathname.startsWith("/protected") || 
                                 nextUrl.pathname.startsWith("/profile") ||
                                 nextUrl.pathname.startsWith("/favorites")
      
      if (isOnProtectedRoute && !isLoggedIn) {
        return false
      }
      
      return true
    },
  },
  trustHost: true,
})

