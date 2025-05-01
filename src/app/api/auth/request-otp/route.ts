import { NextResponse } from "next/server";
import transporter from '@/lib/nodeMailer'
import {prisma} from "@/lib/prisma"


// here we are creating the OTP 
export async function  POST (req:Request){
    try {
        
        const {email} = await req.json();
        if(!email || typeof email !== "string"){
            return NextResponse.json({error:"Adresse email manquante"}, {status:400})
        }

        const user = await prisma.user.findUnique({
            where:{email}
        });

        if (!user) {
            return NextResponse.json({ error: "Aucun utilisateur trouvé avec cet e-mail , inscrivez vous d'abord " }, { status: 404 });
          }

        const otp = Math.floor(100000 + Math.random()*900000).toString()
        const expiresAt = new Date(Date.now() + 10*60*1000 );

        await prisma.user.update({
            where:{email},
            data:{
                otp,
                otpExpiresAt:expiresAt,
                otpAttempts:0,
            }
        })

        await transporter.sendMail({
            from:"  Serik Immo <curtis.dakouri@gmail.com>",
            to:email,
            subject:"votre code de connexion Serik immo",
            html:`<p>Voici votre code de connexion : <strong>${otp}</strong></p><p>Ce code expire dans 10 minutes.</p>`,
        })

     
        return NextResponse.json({success:true, message:'OTP envoye par email.'})


    } catch (error) {
        console.error("Erreur OTP:", error)
        return NextResponse.json({success:false,error},{status:500})
    }
}