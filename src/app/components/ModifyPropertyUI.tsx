"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FilePenLine, ImageDown, LoaderCircle, X } from "lucide-react";
import imageCompression from "browser-image-compression";
import { ScrollArea } from "@/components/ui/scroll-area";

export const houseSchema = z.object({
  title: z.string().min(3).max(15, { message: "il ya plus de 15 lettres" }),
  description: z.string().min(10).max(1000),
  price: z.coerce.number().positive(),
  location: z.string().min(2).max(45, { message: "il ya plus de 45 lettres" }),
  propertyType: z.enum([
    "HOUSE",
    "LAND",
    "APPARTMENT",
    "BUILDING",
    "FARMING",
    "SHOP",
  ]),
  rooms: z.coerce.number().int().min(0),
  bedrooms: z.coerce.number().int().min(0),
  isSwimmingPool: z.boolean().default(false),
  isPrivateParking: z.boolean().default(false),
  propertySize: z.coerce.number().positive().optional().default(0),
  landSize: z.coerce.number().positive().optional().default(0),
  imageUrls: z.array(z.string()).min(1, "Ajoute au moins une image").max(10),
  for: z.enum(["SELL", "RENT"]),
  status: z.enum(["AVAILABLE", "SOLD", "RENTED", "PENDING"]),
});



interface ModifyPropertyUIProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: string;
    rooms: number;
    bedrooms: number;
    isSwimmingPool: boolean;
    isPrivateParking: boolean;
    propertySize: number;
    landSize: number;
    imageUrls: string[];
    for: "SELL" | "RENT";
    status: "AVAILABLE" | "SOLD" | "RENTED" | "PENDING";
  };
}
const extractPublicId = (url: string) => {
  const parts = url.split("/upload/")[1].split(".");
  return parts[0]; 
};


const ModifyPropertyUI : React.FC<ModifyPropertyUIProps> = ({property}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
   const [images, setImages] = useState(
    property.imageUrls.map((url) => ({ url, public_id: extractPublicId(url) }))
  );
const [id] = useState(property.id);
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof houseSchema>>({
    resolver: zodResolver(houseSchema),
    defaultValues: {
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      propertyType: property.propertyType as
        | "HOUSE"
        | "LAND"
        | "APPARTMENT"
        | "BUILDING"
        | "FARMING"
        | "SHOP",
      rooms: property.rooms,
      bedrooms: property.bedrooms,
      isSwimmingPool: property.isSwimmingPool,
      isPrivateParking: property.isPrivateParking,
      propertySize: property.propertySize ?? 0,
      landSize: property.landSize ?? 0,
      imageUrls: property.imageUrls,
      for: property.for,
      status: property.status,
    },
  });
  // ----------------------------------  IMAGE UPLOAD FUCNTION  ---------------------------
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement> | { target: { files: File[] } }
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    for (const file of files) {
      if (images.length >= 10) {
        toast.warning("Limite de 10 images atteinte");
        break;
      }
      if (file.size > 32 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 32 Mo`);
        continue;
      }
      //------------------ COMPRESSING THE FILE BEFORE UPLOADING TO CLOUDINARY -------------
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 2, // taille max finale
        maxWidthOrHeight: 1600, // redimensionnement max
        useWebWorker: true,
      });
      const formData = new FormData();
      formData.append("file", compressedFile);
      try {
        setUploading(true);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur d'upload");
        const { secure_url, public_id } = data.data;
        const newImage = { url: secure_url, public_id };
        setImages((prev) => {
          const updated = [...prev, newImage];
          form.setValue(
            "imageUrls",
            updated.map((img) => img.url)
          );
          // Auto-delete after 10 minutes
          setTimeout(() => {
            const stillExists = images.find(
              (img) => img.public_id === newImage.public_id
            );
            if (stillExists) {
              fetch("/api/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id: newImage.public_id }),
              }).then(() => {
                setImages((prev) =>
                  prev.filter((img) => img.public_id !== newImage.public_id)
                );
                form.setValue(
                  "imageUrls",
                  form
                    .getValues("imageUrls")
                    .filter((url) => url !== newImage.url)
                );
                toast.info("Image supprimée automatiquement après 10 min");
              });
            }
          }, 10 * 60 * 1000); // 10 minutes
          return updated;
        });
      } catch (err) {
        console.log(err);
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      } finally {
        setUploading(false);
      }
    }
  };
  // ----------------------------------  IMAGE REMOVAL FROM CLOUDINARY   ---------------------------
  const handleDeleteImage = async (public_id: string, url: string) => {
    try {
      await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id }),
      });
      setImages((prev) => prev.filter((img) => img.public_id !== public_id));
      form.setValue(
        "imageUrls",
        form.getValues("imageUrls").filter((imgUrl) => imgUrl !== url)
      );
    } catch (err) {
      toast.error("Erreur lors de la suppression de l’image");
    }
  };
  // ----------------------------------  DELETE UPLOAD WHEN USER CANCEL THE FORM  --------------------
  const handleCancelUpload = async () => {
    if (images.length === 0) return;
    try {
      await Promise.all(
        images.map((img) =>
          fetch("/api/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: img.public_id }),
          })
        )
      );
      setImages([]);
      form.setValue("imageUrls", []);
      toast.success("Images supprimées");
    } catch (err) {
      toast.error("Erreur lors de l’annulation");
    }
  };
  // ----------------------------------  SUBMIT MY FORM  ---------------------------
  const onSubmit = async (values: z.infer<typeof houseSchema>) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id,...values}),
      });
      const data = await res.json();
      if (!res.ok)
        return toast.error(data.error || "Erreur lors de la Modification");
      toast.success("Propriété modifiée !");
      router.push("/pages/admin");
    } catch (err) {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const noClickOutside = (
    event: React.FocusEvent | MouseEvent | TouchEvent
  ) => {
    event.preventDefault();
  };
  if (isLoading) return <LoadingPage />;
  return (
    <Dialog>
      <DialogTrigger>
        <FilePenLine strokeWidth={2}   className=" text-muted-foreground bg-transparent hover:text-primary hover:bg-transparent cursor-pointer" />  
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent
            onInteractOutside={noClickOutside}
            onCloseAutoFocus={noClickOutside}
          >
            <ScrollArea className="h-[600px]">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 w-full max-w-3xl mx-auto bg-background border p-6 rounded-xl"
                >
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      if (files.length) {
                        handleImageUpload({ target: { files } } as never);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full  border-3 border-dashed border-muted p-2 rounded-lg text-center cursor-pointer hover:bg-muted/40 transition"
                  >
                    <div className="flex flex-col justify-center items-center">
                      {uploading ? (
                        <LoaderCircle className="font-extrabold text-primary size-32 animate-spin " />
                      ) : (
                        <ImageDown className="font-extrabold size-32 text-primary " />
                      )}
                      <p className="text-sm text-muted-foreground">
                        {uploading
                          ? "téléchargement ..."
                          : "Glissez une image ici ou cliquez (Max 10)"}
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading || images.length >= 10}
                      className="mt-2 cursor-pointer"
                    />
                  </div>

                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;
                      const reordered = [...images];
                      const [removed] = reordered.splice(
                        result.source.index,
                        1
                      );
                      reordered.splice(result.destination.index, 0, removed);
                      setImages(reordered);
                      form.setValue(
                        "imageUrls",
                        reordered.map((img) => img.url)
                      );
                    }}
                  >
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="flex flex-wrap gap-4 mt-2"
                        >
                          {images.map((img, index) => (
                            <Draggable
                              key={img.public_id}
                              draggableId={img.public_id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className="relative w-16 h-21 lg:w-32 lg:h-42 rounded overflow-hidden border  "
                                >
                                  <Image
                                    src={img.url}
                                    alt="uploaded"
                                    fill
                                    className="object-cover"
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteImage(img.public_id, img.url)
                                    }
                                    className="absolute top-0 w-3 h-3 right-0 text-white text-xs px-0 py-3 rounded-full bg-gray-600 hover:bg-red-500"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {/* Other form fields (title, description, etc.) should follow here as-is */}

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
                              <SelectItem value="APPARTMENT">
                                Appartement
                              </SelectItem>
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
                              <SelectItem value="AVAILABLE">
                                Disponible
                              </SelectItem>
                              <SelectItem value="SOLD">Vendu</SelectItem>
                              <SelectItem value="RENTED">Loué</SelectItem>
                              <SelectItem value="PENDING">
                                En attente
                              </SelectItem>
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
                          <Input
                            type="number"
                            {...field}
                            className="bg-input"
                          />
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
                            <Input
                              type="number"
                              {...field}
                              className="bg-input"
                            />
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
                            <Input
                              type="number"
                              {...field}
                              className="bg-input"
                            />
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
                          <Input
                            type="number"
                            {...field}
                            className="bg-input"
                          />
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
                          <Input
                            type="number"
                            {...field}
                            className="bg-input"
                          />
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

                  <Button
                    type="submit"
                    className=" font-semibold text-white w-full "
                    disabled={isLoading}
                  >
                    Modifiez la propriété
                  </Button>
                </form>
              </Form>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    variant={"secondary"}
                    type="button"
                    className=" font-semibold  "
                    onClick={handleCancelUpload}
                    disabled={isLoading}
                  >
                    Annulez
                  </Button>
                </DialogClose>
              </DialogFooter>
            </ScrollArea>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
};

export default ModifyPropertyUI;
