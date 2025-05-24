import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateJWT } from "@/lib/jwt"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email ou OTP manquant" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.otp || !user.otpExpiresAt) {
      return NextResponse.json({ error: "OTP invalide" }, { status: 400 })
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Code incorrect" }, { status: 400 })
    }

    if (new Date() > user.otpExpiresAt) {
      return NextResponse.json({ error: "Code expiré" }, { status: 400 })
    }

    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        emailVerified: true,
      },
    })

    const token = await generateJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })

   
   

    const redirectTo =
      user.role === "SUPERADMIN" || user.role === "ADMIN"
        ? "/pages/dashboard"
        : user.role === "CREATOR"
        ? "/pages/creator"
        : "/pages/properties"

    const response = NextResponse.json({ success: true, message: "Connecté", user, redirectTo })

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
