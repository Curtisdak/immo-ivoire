import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      {/* Banner */}
      <section id="banner" className="relative w-full h-[60vh]">
        <Image
          className="object-cover"
          src="https://images.pexels.com/photos/250659/pexels-photo-250659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="home-picture"
          layout="fill"
          objectFit="cover"
          priority
        />
        <Link href="/" className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center hover:scale-110 transition-transform duration-300">
            Serik Immo
          </h1>
        </Link>
      </section>

      {/* Presentation */}
      <section id="presentation" className="flex flex-col items-center justify-center w-full p-10 space-y-6">
        <h2 className="text-4xl font-bold text-center">
          Serik Immo est l&apos;endroit où vous trouverez votre chez-vous !
        </h2>
        <p className="text-xl text-center">
          Plus de 500 logements à parcourir sur notre plateforme <br /> et une équipe à votre disposition pour trouver le logement de vos rêves.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/">
            <Button className="px-8 py-4 text-lg">Trouver un logement</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="px-8 py-4 text-lg">
              Contactez-nous
            </Button>
          </Link>
        </div>
      </section>

      {/* How Does It Work */}
      <section id="howDoesItWork" className="flex flex-wrap items-center justify-evenly w-full gap-8 p-10">
        <Image
          className="object-cover rounded-lg"
          src="https://images.pexels.com/photos/31424880/pexels-photo-31424880/free-photo-of-concept-immobilier-avec-cles-et-modeles-de-maisons.jpeg"
          width={500}
          height={400}
          alt="house-key-picture"
        />
        <div className="max-w-lg flex flex-col gap-4 text-center lg:text-left">
          <h2 className="text-primary text-3xl font-bold">
            Vous aimeriez être propriétaire d&apos;un logement en Côte d&apos;Ivoire ?
          </h2>
          <p className="text-muted-foreground">
            Découvrez notre sélection exclusive de biens immobiliers en Côte d'Ivoire.
            Grâce à notre expertise locale, nous vous accompagnons dans toutes les étapes
            pour devenir propriétaire de votre futur chez-vous. Que ce soit pour un achat,
            un investissement ou une location, Serik Immo est votre partenaire de confiance.
          </p>
          <Button variant="outline" className="px-8 py-4 text-lg">
            Comment ça fonctionne
          </Button>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section id="Testimonials" className="p-10">
        {/* Future Testimonials content */}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
