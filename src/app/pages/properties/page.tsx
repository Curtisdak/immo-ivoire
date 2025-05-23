"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainPropertyCard from "@/app/components/MainPropertyCard"; // adapte ce chemin selon l’emplacement réel

export type HouseWithRelations = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: "HOUSE" | "LAND" | "APPARTMENT" | "BUILDING" | "FARMING" | "SHOP";
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
  interests: { id: string }[];
  bookmarks: { id: string }[];
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState<HouseWithRelations[]>([]);

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Les maisons</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            
             
                <MainPropertyCard
                  images={property.imageUrls}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  rooms={property.rooms}
                  bedrooms={property.bedrooms}
                  status={property.status}
                  forWhat={property.for}
                  liked={false}
                  onLike={() => console.log("Liked property:", property.id)}
                />
             
          
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
