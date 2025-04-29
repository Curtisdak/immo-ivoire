"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // Revenir à la page précédente
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <AlertTriangle className="w-16 h-16 text-destructive animate-ping" />
      <h1 className="text-3xl font-bold text-destructive">Oups ! Une erreur est survenue.</h1>
      <p className="text-muted-foreground">Veuillez réessayer ou revenir en arrière.</p>
      <Button onClick={handleBack} className="mt-4 animate-pulse text-white ">
        Revenir à la page précédente
      </Button>
    </div>
  );
}
