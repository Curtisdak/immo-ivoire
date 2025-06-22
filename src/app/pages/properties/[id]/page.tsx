"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HouseWithRelations } from "@/types/HouseWithRelations";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  Eye,
  MapPin,
  Home,
  Euro,
  User,
  Star,
  Heart,
  HousePlus,
  LandPlot,
  DoorClosed,
  DoorOpen,
  BedDouble,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/app/components/LoadingSpinner";
import Lightbox from "yet-another-react-lightbox";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "yet-another-react-lightbox/styles.css";
import { Separator } from "@/components/ui/separator";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<HouseWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();

        if (data.success) {
          setProperty(data.property);
          setIsInterested(data.property.isInterested);
          setInterestCount(data.property.interestCount);
          setIsBookmarked(data.property.isBookmarked);
          setBookmarkCount(data.property.bookmarkCount);
        } else {
          toast.error("Propriété introuvable");
          router.push("/pages/properties");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        router.push("/pages/error?message=Erreur+réseau");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, router]);

  const toggleInterest = async () => {
    try {
      const res = await fetch(`/api/properties/${id}/interest`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setIsInterested(data.isInterested);
        setInterestCount(data.interestCount);
      } else {
        toast.error("Échec lors de la mise à jour de l'intérêt");
      }
    } catch (error) {
      toast.error("Erreur réseau");
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`/api/properties/${id}/bookmark`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.isBookmark);
        setBookmarkCount(data.bookmarkCount);
      } else {
        toast.error("Échec lors de la mise à jour du favori");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur réseau");
    }
  };

  const checkPropertyType = (type: string): string => {
    switch (type) {
      case "HOUSE":
        return "Maison";
      case "LAND":
        return "Terrain";
      case "BUILDING":
        return "Immeuble";
      case "APARTMENT":
        return "Appartement";
      case "FARMING":
        return "Terrain agricole";
      case "SHOP":
        return "Boutique";
      default:
        return "Inconnu";
    }
  };

  const ckeckPropertyStatus = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Disponible";
      case "SOLID":
        return "Vendu(e)";
      case "RENTED":
        return "Loué(e)";
      case "PENDING":
        return "En Cours ...";
    }
  };

  const ckeckPropertyIsFor = (isFor: string) => {
    switch (isFor) {
      case "SELL":
        return "À vendre ";
      case "RENT":
        return "À louer";
    }
  };

  if (loading) return <LoadingPage />;
  if (!property) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Image Slider */}
      {property.imageUrls?.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-xl overflow-hidden shadow"
        >
          {property.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Informations principales */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            {property.location}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="w-2 h-2 bg-primary animate-bounce rounded-full">
              {" "}
            </span>
            {ckeckPropertyStatus(property.status)}
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            {property.viewCount} vues
          </div>
          <div className="flex items-center gap-1 text-primary font-semibold">
            <Euro size={16} />
            {property.price.toLocaleString()} FCFA
          </div>
          <div className="flex items-center gap-1 text-primary justify-end">
            {ckeckPropertyIsFor(property.for)}
          </div>
        </div>
        <p className="text-base flex flex-col leading-relaxed whitespace-pre-line">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-muted-foreground"> {property.description} </p>
        </p>

        <Separator />

        {/* Infos clés */}
        <div className="flex flex-col w-full gap-4">
          <h2 className="text-lg font-semibold">Informations clés</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                icon: HousePlus,
                label: "Type de bien",
                value: checkPropertyType(property.propertyType),
              },
              {
                icon: LandPlot,
                label: "Surface Totale",
                value: property.landSize ? `${property.landSize} m²` : "-",
              },
              {
                icon: DoorClosed,
                label: "Habitable",
                value: property.propertySize
                  ? `${property.propertySize} m²`
                  : "-",
              },
              { icon: DoorOpen, label: "Pièces", value: property.rooms || "-" },
              {
                icon: BedDouble,
                label: "Chambres",
                value: property.bedrooms || "-",
              },
            ].map((info, idx) => (
              <div
                key={idx}
                className=" bg-primary/10 rounded-xl flex flex-col items-center text-center gap-2 p-4 hover:shadow-lg transition"
              >
                <info.icon
                  className="w-8 h-8 text-primary"
                  aria-label={info.label}
                />
                <p className="text-sm text-muted-foreground">{info.label}</p>
                <p className="font-bold text-base">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={toggleInterest}
            variant={isInterested ? "default" : "outline"}
          >
            <Heart className="mr-2 h-4 w-4" />
            {isInterested
              ? "Je ne suis plus intéressé(e)"
              : "Je suis intéressé(e)"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {interestCount} intéressé(s)
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            onClick={toggleBookmark}
            variant={isBookmarked ? "default" : "outline"}
          >
            <Star className="mr-2 h-4 w-4" />
            {isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {bookmarkCount} utilisateur(s) ont mis en favori
          </p>
        </div>

        {/* Auteur */}
        <div className="pt-4 border-t mt-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <User size={16} /> Proposé par : {property.postedBy.firstname}{" "}
            {property.postedBy.lastname}
          </p>
          <p>Email : {property.postedBy.email}</p>
        </div>

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/pages/properties")}
        >
          ← Retour aux propriétés
        </Button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={property.imageUrls.map((url) => ({ src: url }))}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.9)" } }}
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;
