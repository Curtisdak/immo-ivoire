import { authOptions } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import errorResponse from "@/lib/errorHandler";
import { cloudinary } from "@/lib/cloudinary";

export const houseSchema = z.object({
  title: z.string().min(3).max(15),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  location: z.string(),
  propertyType: z
    .enum(["HOUSE", "LAND", "APPARTMENT", "BUILDING", "FARMING", "SHOP"])
    .optional()
    .default("HOUSE"),
  rooms: z.number().positive().min(0).optional(),
  bedrooms: z.number().positive().min(0).optional(),
  isSwimmingPool: z.boolean().optional().default(false),
  isPrivateParking: z.boolean().optional().default(false),
  propertySize: z.number().positive().optional(),
  landSize: z.number().positive().optional(),
  imageUrls: z.array(z.string()).max(10),
  for: z.enum(["SELL", "RENT"]).optional().default("SELL"),
  status: z
    .enum(["AVAILABLE", "SOLD", "RENTED", "PENDING"])
    .optional()
    .default("AVAILABLE"),
});

const ALLOWED_ROLES = ["ADMIN", "SUPERADMIN", "CREATOR"];
const ALLOWED_ROLES_FINAL = ["SUPERADMIN", "CREATOR"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé..." },
      { status: 400 }
    );
  }

  const { role, id: userId } = session.user;

  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json(
      { success: false, error: "Accès refusé. Vous n'avez pas les droits" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = houseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Donnéés invalides",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const house = await prisma.house.create({
      data: { ...parsed.data, postedById: userId },
    });

    return NextResponse.json(
      { success: true, message: "Propriété publiée avec succès !", house },
      { status: 200 }
    );
  } catch (error) {
    console.log({
      errorMessage: "Erreur lors de la publication d'une propriété:",
      error,
    });
    return errorResponse("Erreur serveur", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.house.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
            select: { id: true, userId: true, houseId: true, isBookmarked: true },
          },
          _count: {
            select: {
              bookmarks: true,
              interests:true, // 👈 this gives total bookmark count
            },
          },
        },
      }),
      prisma.house.count(),
    ]);

    if (!properties || total === 0) {
      return NextResponse.json(
        { success: false, error: "Aucun bien trouvé" },
        { status: 200 }
      );
    }

    const result = properties.map((prop: any) => ({
      ...prop,
      isBookmarked: prop.bookmarks.length > 0,
      bookmarkCount:prop._count.bookmarks,
      isInterested:prop.interests.length>0,
      interestCount:prop._count.interests,
    }));

    return NextResponse.json(
      {
        success: true,
        properties: result,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur pagination propriétés:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
// ----------------------------------- UPDATE --------------------

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé..." },
      { status: 400 }
    );
  }

  const { role, id: userId } = session.user;

  try {
    const body = await req.json();
    const { id, ...data } = body;
    const parsed = houseSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Donnéés invalides",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const existingHouse = await prisma.house.findUnique({ where: { id } });
    if (!existingHouse) {
      return NextResponse.json(
        { success: false, error: "Propriété non trouvée" },
        { status: 404 }
      );
    }

    if (
      existingHouse.postedById !== userId ||
      !ALLOWED_ROLES_FINAL.includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Vous n'êtes pas autorisé à modifier cette propriété",
        },
        { status: 403 }
      );
    }

    const updatedHouse = await prisma.house.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Propriété mise à jour avec succès !",
        updatedHouse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log({
      errorMessage: "Erreur lors de la mise à jour d'une propriété:",
      error,
    });
    return errorResponse("Erreur serveur", 500);
  }
}

//---------------------------------- DELETE -------------------------------------

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé..." },
      { status: 400 }
    );
  }

  const { role, id: userId } = session.user;

  try {
    const body = await req.json();
    const { id } = body;

    const existingHouse = await prisma.house.findUnique({ where: { id } });
    if (!existingHouse) {
      return NextResponse.json(
        { success: false, error: "Propriété non trouvée" },
        { status: 404 }
      );
    }

    if (
      existingHouse.postedById !== userId &&
      !ALLOWED_ROLES_FINAL.includes(role)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Vous n'êtes pas autorisé à supprimer cette propriété",
        },
        { status: 403 }
      );
    }

    // 🔥 Delete all associated Cloudinary images
    const imageUrls = existingHouse.imageUrls || [];
    const publicIds = imageUrls.map((url) => {
      // extrect public_id from the cloudinary URL

      const decodeUrl = decodeURIComponent(url);
      const neededParts = decodeUrl.split("/upload/")[1].split(".")[0];

      return neededParts;
    });

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
      console.log("ARE IMAGE HAS BEEN DELETED WHEN PROPERTY WAS DELETED");
    }

    await prisma.house.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: "Propriété supprimée avec succès !" },
      { status: 200 }
    );
  } catch (error) {
    console.log({
      errorMessage: "Erreur lors de la suppression d'une propriété:",
      error,
    });
    return errorResponse("Erreur serveur", 500);
  }
}
