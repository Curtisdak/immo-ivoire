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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingPage } from "./LoadingSpinner";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

export const houseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  location: z.string().min(2),
  propertyType: z.enum([
    "HOUSE",
    "LAND",
    "APPARTMENT",
    "BUILDING",
    "FARMING",
    "SHOP",
  ]),
  rooms: z.number().int().min(0),
  bedrooms: z.number().int().min(0),
  isSwimmingPool: z.boolean().default(false),
  isPrivateParking: z.boolean().default(false),
  propertySize: z.number().positive().optional(),
  landSize: z.number().positive().optional(),
  imageUrls: z.array(z.string()).min(1, "Ajoute au moins une image").max(10),
  for: z.enum(["SELL", "RENT"]),
  status: z.enum(["AVAILABLE", "SOLD", "PENDING"]),
});

const AddPropertyUI = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      imageUrls: [],
      for: "SELL",
      status: "AVAILABLE",
    },
  });

  const onSubmit = async (values: z.infer<typeof houseSchema>) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok)
        return toast.error(data.error || "Erreur lors de la publication");
      toast.success("Propriété publiée !");
      router.push("/pages/admin");
    } catch (err) {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-5 w-full">
      <h1 className="text-2xl font-bold mb-6">Publier une propriété</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-3xl mx-auto bg-background border p-6 rounded-xl  "
        >
          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrls"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormLabel className="text-base font-semibold text-primary  ">
                  Photos
                </FormLabel>
                <UploadDropzone
                  className="ut-button:bg-primary ut-button:text-white ut-uploading:bg-muted border-2 border-dashed border-muted rounded-xl p-6 bg-background transition-shadow hover:shadow-md"
                  appearance={{
                    container: "bg-card",
                    uploadIcon: "w-8 h-8 text-muted-foreground", 
                    button:"bg-primary text-white  p-4",
                          // 👈 taille réduite de l’icône ici
                  }}
                  {...field}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((f) => f.ufsUrl);
                    form.setValue("imageUrls", urls);
                    toast.success("Images ajoutées !");
                  }}
                  onUploadError={(error: UploadThingError<Json>) => {
                    toast.error("Erreur lors du téléversement.");
                    console.error("Erreur UploadThing:", error);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localisation</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOUSE">Maison</SelectItem>
                      <SelectItem value="APPARTMENT">Appartement</SelectItem>
                      <SelectItem value="SHOP">Magasin</SelectItem>
                      <SelectItem value="FARMING">Agricole</SelectItem>
                      <SelectItem value="LAND">Terrain</SelectItem>
                      <SelectItem value="BUILDING">Immeuble</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="for"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>À vendre / louer</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SELL">Vente</SelectItem>
                      <SelectItem value="RENT">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Disponible</SelectItem>
                      <SelectItem value="SOLD">Vendu</SelectItem>
                      <SelectItem value="PENDING">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-4">
            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Pièces</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-input" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Chambres</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-input" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="landSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface du terrain (m²)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-input" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface habitable (m²)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-input" />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-8 items-center">
            <FormField
              control={form.control}
              name="isSwimmingPool"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Piscine</FormLabel>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="bg-input"
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPrivateParking"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Parking privé</FormLabel>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="bg-input"
                  />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} className="bg-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            Publier la propriété
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddPropertyUI;
