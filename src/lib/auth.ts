import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { SupabaseAdapter } from '@auth/supabase-adapter';

// Extend the session type to include id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password authentication (for development)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // For development, allow any email/password combination
        // In production, you'd validate against your database
        if (credentials.email && credentials.password) {
          return {
            id: credentials.email, // Use email as ID for now
            email: credentials.email,
            name: credentials.email.split('@')[0], // Use email prefix as name
            image: null,
          };
        }
        return null;
      }
    }),

    // Google OAuth (only if credentials are properly configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],

  // Temporarily disabled until we set up Supabase properly
  // adapter: SupabaseAdapter({
  //   url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  // }),

  pages: {
    signIn: '/auth/signin',
  },

  // Add this for development to bypass Google OAuth temporarily
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
