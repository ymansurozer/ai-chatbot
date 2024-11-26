import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { getUserDetails } from "./services/msGraphApi";
import type { NextAuthConfig, User, Session } from "next-auth";
import { createUser, getUser, isUserExists } from "@/lib/db/queries";

interface ExtendedSession extends Session {
  user: User;
}

export const authConfig = {
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    // https://authjs.dev/getting-started/providers/microsoft-entra-id
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      authorization: {
        // https://learn.microsoft.com/en-us/graph/permissions-overview
        params: {
          scope: "openid profile email User.Read offline_access",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const userDetails = await getUserDetails(account.access_token);
          token.userDetails = userDetails;

          const users = await getUser(userDetails.mail);
          if (users.length === 0) return null;

          token.id = users[0].id;
        } catch (error) {
          console.error(
            "Failed to fetch user details from Microsoft Graph API",
            error
          );
        }
      }
      return token;
    },
    async session({ session, token }: { session: ExtendedSession; token: any }) {
      if(session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      if(user.email){
        const existingUser = await isUserExists(user.email);

        if(!existingUser){
          await createUser(user.email);

          return true;
        }
      }

      return true;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
