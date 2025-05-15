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

    const resetToken = Math.floor(1000000000000 + Math.random() * 9000000000000).toString() + "serik.dev";
    const tokenExpireAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpires: tokenExpireAt,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/pages/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Serik Immo"<${process.env.EMAIL_USER}> `,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
             <h2>Demande de réinitialisation</h2>
             <p>Bonjour <strong> ${user.firstname} </strong> </p>
             <p> Voici votre lien pour réinitialiser votre mot de passe : </p>
             <a href="${resetUrl}" rel="noopener noreferrer">${resetUrl}</a>
             <p>Ce lien expire dans <strong> 10 minutes </strong> .</p>
            `,
    });

    return NextResponse.json({success:true, message:"Email envoyé avec le lien de réinitialisation"},{status:200})
    

  } catch (error) {
    console.error("Erreur forgot-password:", error);
    return errorResponse("error server", 500);
  }
}
