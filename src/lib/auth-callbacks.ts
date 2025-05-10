import { JWT } from "next-auth/jwt"
import { Session, User } from "next-auth"

type JWTCallbackParams = {
  token: JWT
  user?: User
}

type SessionCallbackParams = {
  session: Session
  token: JWT
}

export async function handleJWT({ token, user }: JWTCallbackParams): Promise<JWT> {
  if (user) {
    token.id = user.id
    token.role = user.role
  }
  return token
}

export async function handleSession({ session, token }: SessionCallbackParams): Promise<Session> {
  if (token) {
    session.user.id = token.id as string
    session.user.role = token.role as string
  }
  return session
}
