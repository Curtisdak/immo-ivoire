'use client';
import { Bell, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import SideBar from "./SideBar";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { signOut, useSession  } from "next-auth/react";



const NavBar = () => {
  const {data:session}= useSession();
  const user = session?.user

  
  return (
    <div className="bg-background  flex justify-between items-center sticky w-full  ">
      <Link href="/">
        <p className="font-bold text-primary  p-3 ">
          {" "}
          Serik Immo{" "} {user?.role}
        </p>
      </Link>

      <ul className="hidden lg:flex justify-between items-center gap-4 w-30% p-3 font-bold text-foreground">
        <Link href={"/pages/properties"}> <li className="">Trouver votre maison</li></Link>
        <li>Comment ça functionne?</li>
        <li>Nous Contacter</li>
        {user?.id&&<button onClick={()=> signOut({callbackUrl:"/"})}>deconnextion</button>}
        <Link href={"/pages/add-property"}> <li className="text-primary bg-blue-600">add new</li></Link>
        

      </ul>

      <div className="flex items-center gap-5 justify-between p-3">
        {user?.id ? (
          <div className="flex items-center gap-5 justify-between p-3">
            <Link href="/pages/likes">
              <Heart className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />{" "}
            </Link>
            <Link href="/pages/notifications">
              <Bell className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
            <Link href="/pages/interested">
              <ShoppingBag className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
            <Link href="/pages/profile">
              {" "}
              <User className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
          </div>
        ) : (
          <Link href="/pages/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
        )}
        <ModeToggle />
        <SideBar />
      </div>
    </div>
  );
};

export default NavBar;
