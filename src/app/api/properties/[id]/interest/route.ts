// app/api/properties/[id]/interest/route.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const houseId = params.id;
    const theClient = session.user.role

    const existing = await prisma.interest.findFirst({
      where: { userId, houseId },
    });

    let isInterested: boolean;
    if(!theClient.includes("USER")){
         return NextResponse.json({ success: false, error:"Vous n&pos;est autorisé"});
    }

    if (existing ) {
      // toggle
      const updated = await prisma.interest.update({
        where: { id: existing.id },
        data: { isInterested: !existing.isInterested },
      });
      isInterested = updated.isInterested;
    } else {
      const created = await prisma.interest.create({
        data: {
          userId,
          houseId,
          isInterested: true,
        },
      });
      isInterested = created.isInterested;
    }

    const interestCount = await prisma.interest.count({
      where: {
        houseId,
        isInterested: true,
      },
    });

    return NextResponse.json({ success: true, isInterested, interestCount });
  } catch (error) {
    console.error("Erreur interest PATCH:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
