import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
  type Account,
  type Profile,
  type Session as NextAuthSession // Renamed to avoid conflict with module augmentation
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email"; // Email provider commented out
import { getServerSession as getServerSessionApprouter } from "next-auth/next";

import { prisma } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile }) {
      console.log("[NextAuth Callback] signIn: Triggered");
      console.log("[NextAuth Callback] signIn User:", JSON.stringify(user, null, 2));
      console.log("[NextAuth Callback] signIn Account:", JSON.stringify(account, null, 2));
      console.log("[NextAuth Callback] signIn Profile:", JSON.stringify(profile, null, 2));
      
      // Additional debugging information
      console.log("[NextAuth Callback] Environment check:");
      console.log("- NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
      console.log("- NODE_ENV:", process.env.NODE_ENV);
      console.log("- Google Provider configured:", !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET);
      
      // Basic check for OAuth
      if (account && profile) { // For OAuth providers like Google, account and profile should exist
        console.log("[NextAuth Callback] signIn: OAuth account detected, proceeding.");
        return true;
      }
      
      // If we reach here and it's an OAuth flow (Google provider), something went wrong
      if (!account && user.email) {
        console.error("[NextAuth Callback] signIn: OAuth account missing but user email exists. Possible callback configuration issue.");
        return false;
      }
      
      return true; // Allow sign-in to proceed for other cases
    },
    session: ({ session, user }: { session: NextAuthSession; user: User }) => ({ // Use NextAuthSession here
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER || "", // Ensure EMAIL_SERVER is set in .env
    //   from: process.env.EMAIL_FROM || "no-reply@example.com", // Ensure EMAIL_FROM is set in .env
    // }),
  ],
  pages: {
    signIn: '/auth/signin', // Using our custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (Email provider) Used for check email page
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  events: {
    async signIn(message: { user: User; account: Account | null; profile?: Profile; isNewUser?: boolean }) {
      console.log("NextAuth Event: signIn success", JSON.stringify(message, null, 2));
    },
    async signOut(message: { session?: NextAuthSession; token?: any /* JWT */ }) { // Use NextAuthSession here
      console.log("NextAuth Event: signOut", JSON.stringify(message, null, 2));
    },
    async createUser(message: { user: User }) {
      console.log("NextAuth Event: createUser", JSON.stringify(message, null, 2));
    },
    async updateUser(message: { user: User }) {
      console.log("NextAuth Event: updateUser", JSON.stringify(message, null, 2));
    },
    async linkAccount(message: { user: User; account: Account; profile: User }) { // Changed Profile to User
      console.log("NextAuth Event: linkAccount", JSON.stringify(message, null, 2));
    },
    async session(message: { session: NextAuthSession; token?: any /* JWT */}) { // Use NextAuthSession here
      // This can be very verbose, enable if specifically needed
      // console.log("NextAuth Event: session", JSON.stringify(message, null, 2));
    }
    // Removed the non-standard 'error' event. 'debug: true' will provide error details.
  },
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// Export Next.js App Router compatible auth function
export const auth = () => getServerSessionApprouter(authOptions);