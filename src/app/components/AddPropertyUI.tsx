"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingPage } from "./LoadingSpinner";

export const houseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price:  z.coerce.number().int().min(0),
  location: z.string(),
  propertyType: z.enum(["HOUSE", "LAND", "APPARTMENT", "BUILDING", "FARMING", "SHOP"]).optional().default("HOUSE"),
  rooms: z.coerce.number().int().min(0),
  bedrooms: z.coerce.number().int().min(0),
  isSwimmingPool: z.boolean().default(false),
  isPrivateParking: z.boolean().default(false),
  propertySize: z.coerce.number().int().optional(),
  landSize:z.coerce.number().int().optional(),
  imageUrls: z.array(z.string()).max(10,{message:"Limiter à 10 images"}),
  for: z.enum(["SELL", "RENT"]).optional().default("SELL"),
  status: z.enum(["AVAILABLE", "SOLD", "PENDING"]).optional().default("AVAILABLE"),
});

const AddPropertyUI = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof houseSchema>>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      propertyType: "HOUSE",
      rooms: 0,
      bedrooms: 0,
      isSwimmingPool: false,
      isPrivateParking: false,
      propertySize: 0,
      landSize: 0,
      imageUrls: [""],
      for: "SELL",
      status: "AVAILABLE",
    },
  });

  const onSubmit = async (values: z.infer<typeof houseSchema>) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/properties", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Erreur lors de la publication");
      toast.success(data.message || "Propriété publiée avec succès !");
      router.push("/pages/admin");
    } catch (error) {
      console.log(error);
      toast.error("Erreur réseau");
      router.push("/pages/error?message=problèmes+lien+au+serveur");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-5 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Publier une propriété</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images (URLs séparées par virgule)</FormLabel>
                <FormControl>
                  <Input placeholder="https://img1.jpg, https://img2.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de la propriété..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Localisation</FormLabel>
              <FormControl>
                <Input placeholder="Abidjan, Cocody" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="propertyType" render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="HOUSE">Maison</SelectItem>
                    <SelectItem value="APPARTMENT">Appartement</SelectItem>
                    <SelectItem value="SHOP">Magasin</SelectItem>
                    <SelectItem value="FARMING">Terrain agricole</SelectItem>
                    <SelectItem value="LAND">Terrain</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="for" render={({ field }) => (
              <FormItem>
                <FormLabel>À</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="À vendre/louer" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="SELL">Vendre</SelectItem>
                    <SelectItem value="RENT">Louer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Disponible</SelectItem>
                    <SelectItem value="SOLD">Vendu</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="rooms" render={({ field }) => (
              <FormItem>
                <FormLabel>Pièces</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="bedrooms" render={({ field }) => (
              <FormItem>
                <FormLabel>Chambres</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="landSize" render={({ field }) => (
              <FormItem>
                <FormLabel>Surface terrain (m²)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="propertySize" render={({ field }) => (
              <FormItem>
                <FormLabel>Surface habitable (m²)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex gap-6">
            <FormField control={form.control} name="isSwimmingPool" render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Piscine</FormLabel>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )} />

            <FormField control={form.control} name="isPrivateParking" render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Parking privé</FormLabel>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="Décrivez la propriété..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Chargement..." : "Publier"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddPropertyUI;
