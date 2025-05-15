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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingPage } from "@/app/components/LoadingSpinner";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";
import { signIn } from "next-auth/react";

const formSchema = z
  .object({
    firstname: z.string().min(2, "Prénom requis"),
    lastname: z.string().min(2, "Nom requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Mot de passe trop court"),
    confirmPassword: z.string().min(6, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Inscription échouée");
      } else {
        toast.success("Compte créé avec succès !");
        router.push("/pages/login");
      }
    } catch {
      toast.error("Erreur serveur");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border rounded-md bg-background">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">
          Créer un compte
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: "firstname", label: "Prénom" },
              { name: "lastname", label: "Nom" },
              { name: "email", label: "Email", type: "email" },
              { name: "password", label: "Mot de passe", type: "password" },
              {
                name: "confirmPassword",
                label: "Confirmer mot de passe",
                type: "password",
              },
            ].map(({ name, label, type }) => (
              <FormField
                key={name}
                name={name as keyof z.infer<typeof formSchema>}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      {type !== "password" ? (
                        <Input
                          type={type || "text"}
                          {...field}
                          placeholder={label}
                          disabled={isLoading}
                        />
                      ) : (
                        <div className="relative w-full">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder={label}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeClosed size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </Button>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Chargement..." : "Créer mon compte"}
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-2">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/pages/login"
                className="text-primary hover:underline"
              >
                Connectez-vous ici
              </Link>
            </p>

            <div>
              <div className="flex w-full justify-center items-center">
                <p> Ou </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 p-6  animate-pulse"
                onClick={() => signIn("google")}
              >
                {" "}
                Connectez-vous avec <strong>Google</strong>{" "}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
