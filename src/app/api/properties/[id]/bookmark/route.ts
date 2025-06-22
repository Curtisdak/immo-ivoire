// app/api/properties/[id]/bookmark/route.ts
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

    const existing = await prisma.bookmark.findFirst({
      where: { userId, houseId },
    });
    const theClient = session.user.role;
    if(!theClient.includes("USER")){
         return NextResponse.json({ success: false, error:"Vous n&pos;est autorisé"});
    }

    let isBookmarked: boolean;

    if (existing) {
      // toggle
      const updated = await prisma.bookmark.update({
        where: { id: existing.id },
        data: { isBookmarked: !existing.isBookmarked },
      });
      isBookmarked = updated.isBookmarked;
    } else {
      const created = await prisma.bookmark.create({
        data: {
          userId,
          houseId,
          isBookmarked: true,
        },
      });
      isBookmarked = created.isBookmarked;
    }

    const bookmarkCount = await prisma.bookmark.count({
      where: {
        houseId,
        isBookmarked: true,
      },
    });

    return NextResponse.json({ success: true, isBookmarked, bookmarkCount });
  } catch (error) {
    console.error("Erreur bookmark PATCH:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
