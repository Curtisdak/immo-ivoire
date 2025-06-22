import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { handleJWT, handleSession } from "@/lib/auth-callbacks";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isPasswordCorrect = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) return null;

        // Ensure email is always a string (not null)
        if (!user.email) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: handleJWT,
    session: handleSession,
    async signIn({ user, account }) {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) return true;

      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      const sessionToken =
        typeof account?.access_token === "string"
          ? account.access_token
          : randomUUID();

      await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        },
      });

      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};