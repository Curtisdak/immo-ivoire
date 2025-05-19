import { authOption } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";
import errorResponse from "@/lib/errorHandler";

export const houseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  location: z.string(),
  propertyType: z.enum([ "HOUSE",
 "LAND",
 "APPARTMENT",
 "BUILDING",
 "FARMING",
 "SHOP"]).optional().default("HOUSE"),
  rooms: z.number().positive().min(0),
  bedrooms: z.number().positive().min(0),
  isSwimmingPool: z.boolean().optional().default(false),
  isPrivateParking: z.boolean().optional().default(false),
  propertySize: z.number().positive().optional(),
  landSize: z.number().positive().optional(),
  imageUrls: z.array(z.string()).max(10),
  for:z.enum(["SELL","RENT"]).optional().default("SELL"),
  status: z

    .enum(["AVAILABLE", "SOLD","RENTED", "PENDING"])
    .optional()
    .default("AVAILABLE"),
});

const ALLOWED_ROLES = ["ADMIN", "SUPERADMIN", "CREATOR"];

export async function POST(req: Request) {
  const session = await getServerSession(authOption);

 if (!session || !session.user) {
   return NextResponse.json(
     { sucess: false, error: "Non autorisé...", },
     { status: 400 }
   );
   
  }

  const { role, id: userId } = session?.user;

  if (!ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({
      success: false,
      error: "Accès refusé. Vous n'avez pas les droits",
    });
  }

  try {
    const body = await req.json();
    const parsed = houseSchema.safeParse(body);
    if(!parsed.success){
        return NextResponse.json({success:false, error:"Donnéés invalides", details:parsed.error.format()}, {status:400});
    }

   const house = await prisma.house.create({
      data: {  ...parsed.data, postedById:userId},
    });

return NextResponse.json({success:true, message:"Propriété publiée avec succès !", house},{status:200})

  } catch (error) {
    console.log({errorMessage:"THIS IS THE ERROR ABOUT POSTING A PROPERTY : ",error})
    errorResponse("Erreur serveur",500)
  }
}
