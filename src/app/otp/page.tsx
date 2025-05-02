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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { LoadingPage, LoadingSpinner } from "../components/LoadingSpinner";

const formSchema = z.object({
  otp: z.string().min(6, "Le code doit contenir 6 chiffres"),
});

const OtpPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: values.otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Code invalide");
      } else {
        toast.success("Connexion réussie !");
        router.push("/");
      }
    } catch (error) {
        console.log(error)
      toast("Erreur inattendue, veuillez réessayer");
      router.push("/error?message=Erreur+inattendue+,++veuillez+réessayer")
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async ()=>{
        try {
            setIsResending(true)
            const res = await fetch("/api/auth/resend-otp", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email})
            })


            const data =await res.json()
            if(!res.ok){
                toast.error(data.error && "Erreur lors du renvoi du code")
            }else{toast.success("Nouveau code envoyé à votre adresse email");}
        } catch (error) {
            console.log(error)
            toast.error("Erreur serveur lors du renvoi");
        }finally{setIsResending(false)}
  }

  if(isLoading){
    return <LoadingPage/>
  }


  return (
    <div className="w-screen h-full flex">
      <div className="hidden lg:flex flex-col bg-primary text-accent w-full h-screen items-center justify-center">
        <h2 className="text-4xl font-extrabold mb-4">Entrez votre code</h2>
        <p className="text-xl text-center">
          Le code a été envoyé à {email}
        </p>
      </div>

      <div className="w-full h-screen flex items-center justify-center">
        <div className="p-6 w-full max-w-md">
          <div className="flex lg:hidden flex-col justify-center text-center items-center mb-5">
            <h2 className="text-5xl font-extrabold mb-2 text-primary">
              Entrez votre code !
            </h2>
            <p className="text-lg text-muted-foreground">
              Le code a été envoyé à {email}
            </p>
          </div>

          <h1 className="text-primary font-bold mb-4 text-2xl">Connexion</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Code OTP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="6 chiffres"
                        className="border-0 bg-input text-accent-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex  justify-end text-red-500">
                <Button type="button"  disabled={isResending || isLoading} variant={"link"} onClick={() => handleResend()} >  {isResending ? <p className="animate-pulse">Renvoi en cours...</p> : "Renvoyer le code"} </Button>
              </div>
              <Button type="submit" className="w-full my-4" disabled={isLoading || isResending }>
                {isLoading ? <p className="animate-pulse"> <LoadingSpinner /> Renvoi en cours...</p>  : "Valider le code"}
              </Button>
            </form>
            <Link
              href="/login"
              className="text-primary underline hover:text-accent-foreground"
            >
              Revenir à la connexion
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
