import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { prisma } from "@/lib/prisma"


export async function POST (req:Request){


    try {
        
        const body = await req.json()
        const {password,confirmPassword,token} = body

        if(!password || !confirmPassword || !token){
            return NextResponse.json({success:false, error:"element manquant"}, {status:400})
        }
        if(password !== confirmPassword){
            return NextResponse.json({success:false, error:"les mots de passes ne sont pas identiques"}, {status:400})
        }
       
       const user = await prisma.user.findFirst({
            where:{
                resetToken:token,
                resetExpires:{
                    gte:new Date(),// gte  is to check if date or time  is not expired // non expiré
                }
            },
        })

        if(!user){ 
            return  NextResponse.json({success:false, error:"utilisateur introuvable"}, {status:400})
        }
        const hashedPassword = await bcrypt.hash(password,12)

        await prisma.user.update({
            where:{id:user.id},
            data:{
                hashedPassword,
                resetToken:null,
                resetExpires:null,
            }
        })

        return NextResponse.json({success:true, message:"Mot de passe rénitialisé"},{status:200})

    } catch (error) {
        console.log(error)
    }

}