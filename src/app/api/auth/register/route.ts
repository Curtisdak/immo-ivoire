// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { firstname, lastname, email, password } = await req.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json({success: false, error: "Champs requis manquants" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email déjà utilisé" }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json({ success: true, message:"Vous êtes bien enregistré", user });
  } catch (error) {
    console.error("Erreur inscription :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
