import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma"
import errorHandler from "@/lib/errorHandler"

import transporter from "@/lib/nodeMailer";



export async function POST(req:Request){

    try {

        const {email} = await req.json()
        if(!email || typeof email !== "string"){ return NextResponse.json({success:false, error:"Adresse e-mail manquante"} , {status:400})}

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(!user){return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });}

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        const expiresAt = new Date(Date.now() + 10 * 60 *1000);

        await prisma.user.update({
            where:{email},
            data:{
                otp,
                otpExpiresAt:expiresAt,
                otpAttempts :0
            }
        })


        await transporter.sendMail(
            {
                from: `Serik Immo <process.env.EMAIL_USER>`,
                to:email,
                subject:"Nouveau code de connexion  Serik Immo",
                html:`<p>Votre nouveau code de connexion est : <strong>${otp}</strong></p><p>Ce code expire dans 10 minutes.</p>`
            }
        )
        return NextResponse.json({ success: true, message: "Nouveau code envoyé par e-mail." });
    } catch (error) {
        console.log(error);
        errorHandler("erreur inattendue",500)
    }
}