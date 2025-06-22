// app/api/properties/[id]/view/route.ts

import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {


    const theClient = await getServerSession(authOptions)

    if(theClient?.user.role.includes("USER")){ 

    
    const { id } = params;


    if (!id) {
      return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
    }

    const updated = await prisma.house.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, viewCount: updated.viewCount }); } 
  } catch (error) {
    console.error("Erreur update viewCount:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
