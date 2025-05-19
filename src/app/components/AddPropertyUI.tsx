"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"



export const houseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." })
    .max(100,{message:"le titre ne doit pas 100 lettres "}),
  description: z
    .string()
    .min(10, { message: "La description est trop courte." })
    .max(1000, { message: "La description est trop longue." }),
  price: z
    .number({ invalid_type_error: "Le prix est requis." })
    .positive({ message: "Le prix doit être un nombre positif." }),
  location: z.string({ required_error: "La localisation est requise." }),
  propertyType: z
    .enum(["HOUSE", "LAND", "APPARTMENT", "BUILDING", "FARMING", "SHOP"])
    .optional()
    .default("HOUSE"),
  rooms: z
    .number({ invalid_type_error: "Nombre de pièces requis." })
    .int()
    .min(1, { message: "Il doit y avoir au moins 1 pièce." }),
  bedrooms: z
    .number({ invalid_type_error: "Nombre de chambres requis." })
    .int()
    .min(0, { message: "Le nombre de chambres ne peut pas être négatif." }),
  isSwimmingPool: z.boolean().default(false),
  isPrivateParking: z.boolean().default(false),
  propertySize: z
    .number({ invalid_type_error: "La surface du bien est requise." })
    .positive({ message: "La surface doit être un nombre positif." }),
  landSize: z
    .number({ invalid_type_error: "La surface du terrain est requise." })
    .positive({ message: "La surface du terrain doit être un nombre positif." }),
  imageUrls: z
    .array(z.string())
    .max(10, { message: "Tu peux téléverser jusqu'à 10 images maximum." }),
  for: z.enum(["SELL", "RENT"]).optional().default("SELL"),
  status: z
    .enum(["AVAILABLE", "SOLD", "PENDING"])
    .optional()
    .default("AVAILABLE"),
});




const AddPropertyUI = () => {

    const router = useRouter()
  return (
    <div>
      <h1>hello</h1>
    </div>
  )
}

export default AddPropertyUI
