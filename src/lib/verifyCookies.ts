import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyCookies (req:NextRequest){

    const  token =   req.cookies.get("token")?.value;
    if(!token){
        return NextResponse.redirect(new URL("/login", req.url ) );
    }

    try {
        
     jwt.verify(token, process.env.JWT_SECRET!)
        return NextResponse.next();
    } catch (error) {
        console.log(error)
        return NextResponse.json({error}, {status:500});
    }

}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"  ]
}