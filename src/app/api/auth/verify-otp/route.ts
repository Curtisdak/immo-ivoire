import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers"

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email ou code manquant." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpiresAt) {
      return NextResponse.json({ error: "OTP invalide ou utilisateur inexistant." }, { status: 400 });
    }

    // Vérifie l'expiration
    const now = new Date();
    if (now > user.otpExpiresAt) {
        await prisma.user.update({
            where: { email },
            data: {
              otp: null,
              otpExpiresAt: null,
              otpAttempts: 0,
            },
          });
      return NextResponse.json({ error: "Code expiré, veuillez en demander un nouveau." }, { status: 400 });
    }

    // Vérifie que le code est bon
    if (otp !== user.otp) {
     
      await prisma.user.update({
        where: { email },
        data: {
          otpAttempts: { increment: 1 },
        },
      });

      return NextResponse.json({ error: "Code incorrect." }, { status: 400 });
    }

    // Si tout est OK, on réinitialise les champs OTP
    await prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        emailVerified: true, 
      },
    });

    //  générer un JWT ou une session ici

    const token  = jwt.sign(
        {
        id:user.id,
        email:user.email,
        role:user.role,
    },
    process.env.JWT_SECRET!,
    {expiresIn:"365d"}
);

// Stocke le token dans un cookie HTTPOnly 

 (await
          // Stocke le token dans un cookie HTTPOnly 
          cookies()).set("token", token, {
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    path:"/",
    maxAge:60 * 60 * 24 * 365,
    sameSite:"lax",

} )


    return NextResponse.json({ success: true, message: "Connexion réussie", user});
  } catch (error) {
    console.error("Erreur vérification OTP :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
