"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/app/components/LoadingSpinner";
import { Eye, EyeClosed } from "lucide-react";
import { useSearchParams } from "next/navigation";

//in this, the user is going to create is new so we can send him the link to reset his password

const formSchema = z.object({
  password: z.string().min(10, "Nouveau mot de passe trop court < au moins 10 lettres et plus>"),
  confirmPassword: z.string().min(10, "Confirmation Requise"),
});

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  // this is the user email from login page
  const resetToken = searchParams.get("token");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConf, setShowPasswordConf] = useState(false)
  const[isLoading,setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setIsLoading(true);

    try {

        if (!resetToken) {
            toast.error("Lien invalide ou expiré");
            setLoading(false);
            setIsLoading(false);
            return;
          }
          
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...values, token:resetToken}),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      } else{
        toast.success(data.message);
        setLoading(false);
        router.push('/pages/login');
        return
      }

    } catch (error) {
      console.info(error);
       return router.push(`/pages/error?message=Nous+vous+conseillons+de+re-éssayer`)
    }finally{setIsLoading(false) }
  };

  //-----------------------------------------------

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex">
      <div className="hidden lg:flex w-screen  h-screen  bg-primary justify-center items-center flex-col text-black">
        <h1 className="text-4xl font-bold mb-12">Serik Immo</h1>
        <h2 className="text-2xl font-bold ">
          Renitialisez votre de mot passe en toute sécurité
        </h2>
      </div>

      <div className="flex flex-col gap-4 justify-center items-center p-6 w-screen h-screen ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full lg:max-w-lg  "
          >
            <h1 className="text-2xl text-center font-bold lg:hidden">
            Renitialisez votre de mot passe en toute sécurité
            </h1>
            <p className="text-center mb-10">
              Après la renitialisation de votre mot de passe , vous serez redirigé sur la page de connexion pour insérer votre nouveau mot de passe.
            </p>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder='Insérez votre nouveau mot de passe'
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
    control={form.control}
    name="confirmPassword"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Confirmation du nouveau mot de passe </FormLabel>
        <FormControl>
          <div className="relative w-full">
            <Input
              {...field}
              type={showPasswordConf ? "text" : "password"}
              placeholder="....confirmation "
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary"
              onClick={() => setShowPasswordConf((prev) => !prev)}
            >
              {showPasswordConf ? (
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

            <Button disabled={isLoading} className="w-full" type="submit">
              Creer mon nouveau mot de passe
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
