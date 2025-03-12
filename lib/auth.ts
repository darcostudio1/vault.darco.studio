import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// In a real app, this would be a database call
const validateCredentials = async (credentials: Record<string, string>) => {
  // TEMPORARY: Auto-authenticate without checking credentials
  // This is for development purposes only and should be reverted when login is needed again
  return {
    id: '1',
    name: 'Temporary User',
    email: 'temp@example.com',
  };

  // Original validation code (commented out temporarily)
  /*
  const validEmail = 'darian@darco.studio';  // Updated email
  const validPassword = 'Febru@ry!2018';  // Updated password

  if (credentials.email === validEmail && credentials.password === validPassword) {
    return {
      id: '1',
      name: 'Darian',  // Updated name to match email
      email: validEmail,
    };
  }

  return null;
  */
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TEMPORARY: Auto-authenticate even without credentials
        // This is for development purposes only
        return await validateCredentials(credentials || {});
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
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
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};

export default authOptions;