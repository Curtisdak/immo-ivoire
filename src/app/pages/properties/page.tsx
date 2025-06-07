"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import MainPropertyCard from "@/app/components/MainPropertyCard"; // adapte ce chemin selon l’emplacement réel
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProperties } from "@/app/context/PropertiesContext";


const PropertiesPage = () => {
 const { properties, setProperties } = useProperties();
  const router = useRouter();


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
            property={property}
            onDelete={deleteProperty}
            />

         
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
