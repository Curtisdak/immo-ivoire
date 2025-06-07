// context/PropertiesContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

import  {HouseWithRelations} from "../../types/HouseWithRelations"

interface PropertiesContextType {
  properties: HouseWithRelations[];
  refreshProperties: () => void;
  setProperties: React.Dispatch<React.SetStateAction<HouseWithRelations[]>>;
}

const PropertiesContext = createContext<PropertiesContextType | null>(null);

export const PropertiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [properties, setProperties] = useState<HouseWithRelations[]>([]);

  const refreshProperties = async () => {
    try {
      const res = await fetch("/api/properties?page=1&limit=30");
      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
      } else {
        toast.error("Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  

  useEffect(() => {
    refreshProperties();
  }, []);

  const value = useMemo(
    () => ({ properties, refreshProperties, setProperties }),
    [properties]
  );

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const ctx = useContext(PropertiesContext);
  if (!ctx) throw new Error("useProperties must be used inside <PropertiesProvider>");
  return ctx;
};
