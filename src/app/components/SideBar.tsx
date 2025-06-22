"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CircleHelp,
  Heart,
  LayoutDashboard,
  MapPinHouse,
  MessageCircleHeart,
  Phone,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SideBar() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const avatarFallback = currentUser?.name
    ? currentUser.name.substring(0, 2).toUpperCase()
    : "??";

  return (
    <div className="flex ">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"outline"}
            className="scale-140 m-2 rounded-3xl  outline-primary "
          >
            {" "}
            <User className="w-8 h-8 text-primary" />{" "}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{currentUser?.name}</SheetTitle>
            <SheetDescription>{currentUser?.email}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-10 p-4">
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              {" "}
              <User /> Mon profil{" "}
            </Link>
            {["ADMIN", "SUPERADMIN", "CREATOR"].includes(
              currentUser?.role ?? ""
            ) && (
              <Link
                href="/pages/admin"
                className="gap-4 w-full flex  hover:text-primary hover:scale-125 duration-500"
              >
                {" "}
                <LayoutDashboard /> <p>Dashboard </p>{" "}
                <span className="text-sm text-muted-foreground italic">
                  Admin, superAdmin
                </span>{" "}
              </Link>
            )}
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              {" "}
              <MessageCircleHeart /> Mes intérêts en cours{" "}
            </Link>
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              {" "}
              <Heart /> Mes favoris{" "}
            </Link>
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              {" "}
              <MapPinHouse /> Trouver votre maison
            </Link>
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              {" "}
              <CircleHelp /> Comment ça fonctionne ?
            </Link>
            <Link
              href="/pages/properties"
              className="gap-4 w-full flex hover:text-primary hover:scale-125 duration-500"
            >
              <Phone />
              Nous Contacter
            </Link>
          </div>

          <SheetFooter>
            <div className="flex items-center gap-2">
              <Avatar className="cursor-pointer ">
                <AvatarImage
                  src={currentUser?.image || ""}
                  alt={currentUser?.name || "user"}
                  className="scale-150"
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <Button
                variant={"link"}
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                {" "}
                Se déconnecter{" "}
              </Button>
            </div>

            <Link href="/" className="text-sm text-muted-foreground italiccd  ">
              Developed by Serik
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
