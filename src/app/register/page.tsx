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
import { LoadingPage, LoadingSpinner } from "../components/LoadingSpinner";

const formSchema = z.object({
  firstname: z.string().min(3, "Votre Prénom est trop court").trim(),
  lastname: z.string().min(3, "Votre nom est trop court").trim(),
  email: z.string().email("Adresse email invalide").trim(),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 8, {
      message: "Le numéro de téléphone doit contenir au moins 8 chiffres",
    }),
});

const RegisterPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setServerError("");
      setIsLoading(true);
      const res = await fetch("/api/auth/registers", {
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
      router.push("/error?message=Impossible+de+se+connecter+à+la+base+de+données");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-full flex ">
      {isLoading && <LoadingPage />}
      <div className="hidden  lg:flex flex-col bg-primary  text-accent w-full h-screen items-center justify-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Bienvenue sur Serik Immo
        </h2>
        <p className="text-xl">
          Trouvez la maison de vos rêves en toute simplicité avec Serik Immo
        </p>
      </div>

      <div className=" w-full h-screen flex items-center justify-center text-primary ">
        <div className="p-6 w-full max-w-md">
          <div className="flex lg:hidden flex-col justify-center text-center items-center mb-5 ">
            <h2 className="text-5xl font-extrabold mb-2  ">
              Bienvenue sur Serik Immo !
            </h2>
            <p className="text-lg text-muted-foreground">
              Trouvez la maison de vos rêves en toute simplicité avec Serik Immo
            </p>
          </div>

          <h1 className="font-bold mb-4 text-2xl">Inscrivez-vous</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {[
                { name: "firstname", label: "Prénom" },
                { name: "lastname", label: "Nom" },
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
                        <Input
                          {...field}
                          placeholder={label}
                          className=" border-0  bg-input text-accent-foreground "
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full my-4"
              >
                {isLoading ? <LoadingSpinner /> : "S'inscrire"}
              </Button>
            </form>
            <Link href="/login" className=" underline  ">
              Vous avez déja un compte? Connectez vous ici
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
