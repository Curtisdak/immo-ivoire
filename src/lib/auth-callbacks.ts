/* eslint-disable @typescript-eslint/no-explicit-any */
import { JWT } from "next-auth/jwt"
import { Session, User } from "next-auth"

interface ExtendedUser extends User {
  role?: string;
}

interface ExtendedToken extends JWT {
  id?: string;
  role?: string;
  email?: string;
}

type JWTCallbackParams = {
  token: JWT;
  user?: User;
}

type SessionCallbackParams = {
  session: Session;
  token: JWT;
}

export async function handleJWT({ token, user }: JWTCallbackParams): Promise<JWT> {
  if (user) {
    const u = user as ExtendedUser;
    token.id = u.id;
    token.email = u.email ?? "";
    token.role = u.role ?? "USER";
  }
  return token;
}

export async function handleSession({ session, token }: SessionCallbackParams): Promise<Session> {
  const t = token as ExtendedToken;
  session.user.id = t.id ?? "";
  session.user.email = t.email ?? "";
  session.user.role = t.role ?? "USER";
  return session;
}
