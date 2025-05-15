import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { handleJWT, handleSession } from "@/lib/auth-callbacks";
import { compare } from "bcryptjs";

export const authOption: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Utilisateur non trouvé ou mot de passe manquant");
        }

        const isPasswordCorrect = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordCorrect) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: handleJWT,
    session: handleSession,

    async redirect({baseUrl}){
      return `${baseUrl}/pages/properties`
    }
  },
  pages: {
    signIn: "/pages/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
