"use client";

import { Loader2, Loader, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function LoadingSpinner() {
  return <Loader className="h-5 w-5 animate-spin" />;
}

export function LoadingPage() {
   const[isLoading, setIsLoading] = useState<boolean>(true);
  // this component will behave has a loading page
  if(!isLoading) return null
  return (
    <div className="w-screen h-screen  fixed inset-0  z-50 bg-black/80  flex items-center justify-center">
      <div className="flex flex-col gap-3 justify-center items-center ">
        <Loader2 className="h-15 w-15 animate-spin shadow-2xl" />
        <Link href={"/"}>
          {" "}
          <h2 className=" text-2xl font-bold animate-pulse text-primary">
            Serik Immo
          </h2>{" "}
        </Link>
        <X  onClick={()=> setIsLoading(false) } className="bg-black/80 w-15 h-15 p-1 font-extrabold text-primary rounded-full ease-in-out duration-300 absolute bottom-6 cursor-pointer hover:scale-110" />
      </div>
    </div>)
  ;
}
