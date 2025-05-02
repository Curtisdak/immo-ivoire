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
  email: z.string().email("Adresse email invalide").trim(),
});

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
   
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error( data.console.error ||  "❌ Échec de l'envoi du code");
      } else {
        toast.success(
          "✅ Code a été envoyé par email."
        );
        router.push(`/otp?email=${values.email}`);
      }
    } catch (error) {
      console.log(error);
      toast("🚨 Erreur inattendue,veuillez réessayer");
    } finally{
      setIsLoading(false)
    }
  };

  if(isLoading){
    return <LoadingPage/>
  }

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
          
          <div  className="flex lg:hidden flex-col justify-center text-center items-center mb-5 ">
            <h2 className="text-5xl font-extrabold mb-2  text-primary ">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Adresse email</FormLabel>
                  <FormControl>
                    <Input className="border-0  bg-input text-accent-foreground" placeholder="exemple@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


              <Button type="submit" className="w-full my-4">
              {isLoading ? <LoadingSpinner /> : "Envoyer le code"}
              </Button>
            </form>
            <Link href="/register" className="text-primary underline hover:text-accent-foreground ">Si vous n&apos;avez pas de compte, creez un compte ici </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
