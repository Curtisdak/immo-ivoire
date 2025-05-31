"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainPropertyCard from "@/app/components/MainPropertyCard"; // adapte ce chemin selon l’emplacement réel
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type HouseWithRelations = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType:
    | "HOUSE"
    | "LAND"
    | "APPARTMENT"
    | "BUILDING"
    | "FARMING"
    | "SHOP";
  rooms: number;
  bedrooms: number;
  isSwimmingPool: boolean;
  isPrivateParking: boolean;
  propertySize?: number;
  landSize?: number;
  imageUrls: string[];
  for: "SELL" | "RENT";
  status: "AVAILABLE" | "SOLD" | "RENTED" | "PENDING";
  createdAt: string;
  updatedAt: string;
  postedBy: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string | null;
  };
  isBookmarked: boolean;
  interests: { id: string; userId: string; houseId: string; isInterested:boolean };
  bookmarks: { id: string; userId: string; houseId: string; isBookmarked:boolean };
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState<HouseWithRelations[]>([]);
  const router = useRouter();

  const getProperties = async () => {
    const res = await fetch("/api/properties?page=1&limit=30");
    const data = await res.json();
    if (data.success) {
      setProperties(data.properties);
    } else {
      console.error("Erreur:", data.error);
    }
  };

  useEffect(() => {
    getProperties();
  }, []);

  const deleteProperty = async (id: string) => {
    try {
      const res = await fetch("/api/properties", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setProperties((prev) => prev.filter((prop) => prop.id !== id));
        toast.success("Propriété supprimée !");
      } else {
        console.log(data.error);
        toast.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la suppression:", error);
      router.push("/pages/error?message=Erreur+réseau+lors+de+la+suppression");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Les maisons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  ">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MainPropertyCard
              propertyId={property.id}
              postedBy={property.postedBy.email}
              images={property.imageUrls}
              title={property.title}
              location={property.location}
              propertyType={property.propertyType}
              propertySize={property.propertySize ?? 0}
              description={property.description}
              landSize={property.landSize ?? 0}
              isSwimmingPool={property.isSwimmingPool}
              isPrivateParking={property.isSwimmingPool}
              price={property.price}
              rooms={property.rooms}
              bedrooms={property.bedrooms}
              status={property.status}
              forWhat={property.for}
              onDelete={deleteProperty}
             isBookmarked={property.isBookmarked}
              // interests={property.interests}
            />

         
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
