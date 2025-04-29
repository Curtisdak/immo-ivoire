"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide").trim(),
  phone: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
});

const LoginPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setServerError("");
      const res = await fetch("/api/auth/register", {
        // ✅ Corrected here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "L'inscription a échoué");
        toast("❌ Échec de l'inscription");
      } else {
        toast(
          "✅ Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast("🚨 Erreur inattendue,veuillez réessayer");
    }
  };

  return (
    <div className="w-screen h-full flex ">
      <div className="hidden  lg:flex flex-col bg-primary text-accent w-full h-screen items-center justify-center">
        <h2 className="text-4xl font-extrabold mb-4">Connectez-vous sur Serik Immo</h2>
        <p className="text-xl text-center ">
          Trouvez la maison de vos rêves en toute simplicité avec Serik Immo en vous connectant
        </p>
      </div>

      <div className=" w-full h-screen flex items-center justify-center">
        <div className="p-6 w-full max-w-md">
          <div className="flex lg:hidden flex-col justify-center text-center items-center mb-5 ">
            <h2 className="text-5xl font-extrabold mb-2  ">
            Connectez-vous sur Serik Immo!
            </h2>
            <p className="text-lg text-muted-foreground">
              Trouvez la maison de vos rêves en toute simplicité avec Serik Immo
            </p>
          </div>

          <h1 className="text-primary font-bold mb-4 text-2xl">
          Connectez-vous
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              {[
               
               
                { name: "email", label: "Adresse email" },
                { name: "phone", label: "Numéro de téléphone" },
              ].map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">{label}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={label} className=" border-0  bg-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              
              <Button type="submit" className="w-full my-4">
               Se connecter
              </Button>
            </form>
            <Link href="/register" className="text-accent-foreground underline ">Si vous n&apos;avez pas de compte, creez un compte ici </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
