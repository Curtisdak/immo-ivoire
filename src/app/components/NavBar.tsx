import { Bell, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import SideBar from "./SideBar";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const isConected: boolean = false;
  return (
    <div className="bg-background  flex justify-between items-center sticky w-full  ">
      <Link href="./">
        <p className="font-bold text-primary  p-3 ">
          {" "}
          Serik Immo{" "}
        </p>
      </Link>

      <ul className="hidden lg:flex justify-between items-center gap-4 w-30% p-3 font-bold text-foreground">
        <li className="">Trouver votre maison</li>
        <li>Comment ça functionne?</li>
        <li>Nous Contacter</li>
      </ul>

      <div className="flex items-center gap-5 justify-between p-3">
        {isConected ? (
          <div className="flex items-center gap-5 justify-between p-3">
            <Link href="/likes">
              <Heart className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />{" "}
            </Link>
            <Link href="/notifications">
              <Bell className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
            <Link href="/interested">
              <ShoppingBag className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
            <Link href="/profile">
              {" "}
              <User className="cursor-pointer hover:scale-140 hover:text-primary ease-in duration-100" />
            </Link>
          </div>
        ) : (
          <Link href="/login">
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
