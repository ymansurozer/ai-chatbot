import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// https://authjs.dev/guides/upgrade-to-v5
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
});
