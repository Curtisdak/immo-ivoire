// app/api/delete/route.ts
import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";


export async function DELETE(req: Request) {
    const ALLOWED_ROLES = ["ADMIN", "SUPERADMIN", "CREATOR"]

    const session = await getServerSession(authOption)
    if(!session?.user.id){
        return NextResponse.json({success:false, error:"Unauthorized"},{status:401})
    }

     if(!ALLOWED_ROLES.includes(session?.user.role)){
     return NextResponse.json({success:false, error:"Unauthorized Role"},{status:403})
 }
  const { public_id } = await req.json();

  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
