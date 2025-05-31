import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import errorResponse from "@/lib/errorHandler";

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Utilisateur introuvable" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const { propertyId } = await req.json();

  if (!propertyId) {
    return NextResponse.json(
      { success: false, error: "Pas de propriété trouvée" },
      { status: 400 }
    );
  }

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_houseId: { userId: userId, houseId: propertyId } }
    });

    let liked = false;

    if (existingBookmark) {
      // Unbookmark → either delete OR update flag to false
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      liked = false;
    } else {
      // Add new bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          houseId: propertyId,
          isBookmark: true,
        },
      });
      liked = true;
    }

    return NextResponse.json({ success: true, liked });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return errorResponse("Erreur serveur", 500);
  }
}
