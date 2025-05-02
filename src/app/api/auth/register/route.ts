
import { prisma } from '@/lib/prisma' 
import { NextResponse } from "next/server";
import errorResponse from "@/lib/errorHandler"



export  async function POST(req:Request){

try {
    const body = await req.json()
    const { firstname, lastname, email, phone } = body

    if (!firstname || !lastname || !email ) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
      }

      const existingUser = await prisma.user.findFirst({
        where:{OR:[{email},{phone}]},
      })


      if(existingUser){
        return NextResponse.json({success:false, error:"User already exists"},{status:409})
      }

      const newUser = await prisma.user.create({
        data:{
            firstname,
            lastname,
            email,
            phone:phone || null,
        }
      })

      return NextResponse.json({ success:true, message: 'User registered', user: newUser }, { status: 201 })

} catch (error) {
    console.error('Registration error:', error)
    return errorResponse('Internal server error', 500)
}

}