"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight, Bed, DoorOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeletePropertyUI from "./DeletePropertyUI";
import ModifyPropertyUI from "./ModifyPropertyUI";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import  {HouseWithRelations} from "../../types/HouseWithRelations"

interface PropertyCardProps {
   property: HouseWithRelations;
 /* propertyId: string;
  postedBy: string;
  images: string[];
  title: string;
  description: string;
  location: string;
  propertyType?:
    | "HOUSE"
    | "LAND"
    | "APPARTMENT"
    | "BUILDING"
    | "FARMING"
    | "SHOP";
  price: number;
  propertySize: number;
  landSize: number;
  rooms: number;
  bedrooms: number;
  forWhat: "SELL" | "RENT";
  status?: "AVAILABLE" | "SOLD" | "RENTED" | "PENDING";
  isSwimmingPool: boolean;
  isPrivateParking: boolean;
  isBookmarked: boolean;
  bookmarkCount: number;*/
  onView?: (id:string) => void;
  onDelete?: (id: string) => void;
}

const MainPropertyCard: React.FC<PropertyCardProps> = ({property,onView,onDelete}) => {

  const {
    id,
    title,
    description,
    price,
    location,
    propertyType,
    rooms,
    bedrooms,
    isSwimmingPool,
    isPrivateParking,
    propertySize,
    landSize,
    imageUrls,
    for: forWhat,
    status,
    isBookmarked,
    bookmarkCount, 
} = property;


  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [liked, setLiked] = useState<boolean>(isBookmarked);
  const [bookmarkTotal, setBookmarkTotal] = useState<number>(
    bookmarkCount ?? 0
  );
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
    } else if (diff < -50) {
      setCurrentIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
    }
    touchStartX.current = null;
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0));
  };

  const statusLabel = {
    AVAILABLE: "Disponible",
    SOLD: "Vendu",
    RENTED: "Loué",
    PENDING: "En attente",
  }[status];

  const statusColor = {
    AVAILABLE: "bg-green-500/40",
    SOLD: "bg-red-500/40",
    RENTED: "bg-yellow-500/40",
    PENDING: "bg-orange-400/40",
  }[status];

  const handleLike = async (propertyId: string) => {
    try {
      setLoading(true);
      const res = await fetch("/api/properties/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          data.liked ? "Ajouté aux favoris !" : "Retiré des favoris !"
        );
        setLiked(data.liked);
        setBookmarkTotal((prev) => prev + (data.liked ? 1 : -1));
      } else {
        toast.error("ce button ne fonctionne pas !");
      }
    } catch (error) {
      console.log(error);
      router.push("/pages/error?message=problème+lié+au+serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-4 w-full max-w-sm rounded-xl overflow-hidden shadow-md shadow-muted  bg-transparent opacity-100  ease-in duration-400">
      {/* Image Slider */}
    
        {" "}
        {["ADMIN", "SUPERADMIN", "CREATOR"].includes(
          currentUser?.role ?? "") &&   <div className="flex justify-between  items-center p-2">
           <p className="text-muted-foreground ">{property.postedBy.email ?? ""}</p>
        <ModifyPropertyUI
          property={{
            id: id ,
            title,
            description,
            price,
            location,
            propertyType,
            rooms,
            bedrooms,
            isSwimmingPool,
            isPrivateParking,
            propertySize,
            landSize,
            imageUrls,
            for: forWhat,
            status,
          }} />
      </div>}



      <div
        className="relative w-full h-64  "
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
      >
        {imageUrls.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt={`image-${i}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-700 ",
              i === currentIndex ? "opacity-100" : "opacity-0"
            )}
          />
        ))}

        {/* Status badge */}
        <div
          className={cn(
            "absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white rounded-full rounded-br-none z-30",
            statusColor
          )}
        >
          {statusLabel}
        </div>

        {/* Fade overlay */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-background to-transparent z-10" />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrev}
          className="absolute cursor-pointer left-1 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-primary/50  hover:text-black text-primary p-1 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-primary/50 hover:text-black  text-primary p-1 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {imageUrls.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={cn(
                "w-3 h-3 rounded-full cursor-pointer",
                i === currentIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Like Button */}
        <button
          onClick={() => handleLike(id)}
          disabled={loading}
          className={cn(
            "absolute bottom-3 left-3 z-20 bg- p-1 rounded-full shadow-md hover:scale-125 ease-in-out duration-500",
            loading ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          <Heart
            className={cn(
              "w-8 h-8 stroke-primary cursor-pointer ",
              liked ? "fill-primary" : "stroke-primary"
            )}
          />
        </button>
      </div>

      {/* Property Info */}
      <div className="p-4 space-y-1 bg-card">
        <div className="flex flex-wrap items-baseline-last justify-between">
          <h3 className="text-lg font-semibold ">{title}</h3>
          <p className="text-muted-foreground">
            {forWhat.includes("SELL") ? "à vendre" : "à louer"}
          </p>
        </div>
        <p className="text-muted-foreground text-sm font-bold">
          {price.toLocaleString()} FCFA
        </p>
        <p className="text-md text-muted-foreground line-clamp-1">{location}</p>

        <div className="flex flex-wrap items-baseline-last justify-start gap-2">
          {rooms > 0 && (
            <span className="p-1 rounded-xl items-center-safe flex gap-1 bg-primary/10">
              {/*---------------- Room  ---------- */}{" "}
              <DoorOpen className="text-muted-foreground" />{" "}
              <p className="hidden text-sm text-muted-foreground lg:flex">
                {rooms > 1 ? "Pièces" : "Pièce"}
              </p>{" "}
              <span className="p-1 text-white font-bold rounded-full bg-primary/70">
                {" "}
                {rooms}{" "}
              </span>{" "}
            </span>
          )}
          {/*---------------- Bedroom---------- */}
          {bedrooms > 0 && (
            <span className="p-1 rounded-xl items-center-safe flex gap-1 bg-primary/10">
              {" "}
              <Bed className="text-muted-foreground" />{" "}
              <p className="hidden text-sm text-muted-foreground lg:flex">
                {bedrooms > 1 ? "Chambres" : "Chambre"}
              </p>{" "}
              <span className="p-1 text-white font-bold rounded-full bg-primary/70">
                {" "}
                {bedrooms}{" "}
              </span>{" "}
            </span>
          )}
          {/*---------------- for sell / rent ---------- */}
        </div>

        <div className="flex w-full justify-end place-items-center gap-4 relative ">
          {["ADMIN", "SUPERADMIN", "CREATOR"].includes(
            currentUser?.role ?? ""
          ) && (
            <span className="absolute left-0 bottom-0">
              {" "}
              <DeletePropertyUI
                propertyId={id}
                onDelete={(id) => onDelete?.(id)}
                alertTitle={"Es-tu sûr de vouloir supprimer cette propriété ?"}
                alertDesc={
                  "Sachez que si vous supprimez ce bien, il sera supprimé pour TOUJOURS  "
                }
              />{" "}
            </span>
          )}
          <Button
            className="mt-2 font-bold hover:bg-accent hover:text-primary"
           onClick={()=> onView?.(property.id)}
          >
            Voir plus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainPropertyCard;
