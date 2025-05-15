"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


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
import Link from "next/link";
import { LoadingPage } from "@/app/components/LoadingSpinner";
import { Eye, EyeClosed } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      ...values,
    });
  

    if (res?.error) {
      toast.error("Identifiants incorrects");
      router.push("/pages/error?message:Identifiants incorrects");
    } else {
      setLoading(false);
      toast.success("Connexion réussie");
      if(res?.url){
       router.push(res.url);
     
      } 
      
    }
  };
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={"mot de passe"}
                      disabled={loading}
                     
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <div>
            <p className="text-muted-foreground ">
              {" "}
              Vous n&apos;avez encore de compte?{" "}
              <Link
                className="text-primary hover:underline "
                href={"/pages/register"}
              >
                Inscrivez ici
              </Link>{" "}
            </p>
          </div>

          <div>
            <div className="flex w-full justify-center items-center">
              <p> Ou </p>
            </div>
            <Button
            type="button"
              variant="outline"
              className="w-full mt-4 p-6  animate-pulse"
              onClick={() => signIn("google")}
            >  Connectez-vous avec <strong>Google</strong>  </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
