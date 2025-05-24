"use client"

import { useRouter,useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('message')  ;

  const handleBack = () => {
    router.back(); // Revenir à la page précédente
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <AlertTriangle className="w-16 h-16 text-destructive animate-ping" />
      <h1 className="text-3xl font-bold text-destructive">Oups !</h1>
      <p className="text-muted-foreground text-center p-2 text-2xl">{errorMessage}</p>
      <Button onClick={handleBack} className="mt-4 animate-pulse text-white ">
        Revenir à la page précédente
      </Button>
      <Link href={'/'} className="bg-primary p-4 rounded-full mt-10 hover:animate-pulse hover:bg-secondary " ><Home size={40} /></Link>
    </div>
  );
}
