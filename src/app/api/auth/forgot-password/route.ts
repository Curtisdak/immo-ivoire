import errorResponse from "@/lib/errorHandler";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import transporter from "@/lib/nodeMailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email requis !" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Aucun utilisateur avec cet email" },
        { status: 400 }
      );
    }

    const resetToken = Math.floor(10000000 + Math.random() * 90000000).toString();
    const tokenExpireAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpires: tokenExpireAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_UR}/pages/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Serik Immo"<${process.env.EMAIL_USER}> `,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
             <h2>Demande de réinitialisation</h2>
             <p>Bonjour ${user.firstname} </p>
             <p> Voici votre lien pour réinitialiser votre mot de passe : </p>
             <a href="${resetUrl}" target="_blank">${resetUrl}</a>
             <p>Ce lien expire dans <strong> 15 minutes </strong> .</p>
            `,
    });

    return NextResponse.json({success:true, message:"Email envoyé avec le lien de réinitialisation"},{status:400})
    

  } catch (error) {
    console.error("Erreur forgot-password:", error);
    errorResponse("error server", 500);
  }
}
