// app/api/properties/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import  {authOptions}  from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!params.id) {
      return NextResponse.json({ success: false, error: "ID manquant" }, { status: 400 });
    }

    const property = await prisma.house.findUnique({
      where: { id: params.id },
      include: {
        postedBy: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            avatar: true,
          },
        },
        interests: {
          where: { userId: session?.user.id },
          select: {
            id: true,
            userId: true,
            houseId: true,
            isInterested: true,
          },
        },
        bookmarks: {
          where: { userId: session?.user.id },
          select: {
            id: true,
            userId: true,
            houseId: true,
            isBookmarked: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
            interests: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propriété non trouvée" },
        { status: 404 }
      );
    }

    const result = {
      ...property,
      isBookmarked: property.bookmarks.length > 0,
      bookmarkCount: property._count.bookmarks,
      isInterested: property.interests.length > 0,
      interestCount: property._count.interests,
    };

    return NextResponse.json({ success: true, property: result });
  } catch (error) {
    console.error("Erreur route /api/properties/[id] :", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
