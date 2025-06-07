'use client';

import React from "react";
import { Bell, Heart, Home, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PhoneNavBar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: <Home size={28} />, label: "Accueil" },
    { href: "/pages/likes", icon: <Heart size={28} />, label: "Favoris" },
    { href: "/pages/add-property", icon: <Plus size={28} />, label: "Ajouter" },
    { href: "/pages/properties", icon: <Search size={28} />, label: "Rechercher" },
    { href: "/pages/notifications", icon: <Bell size={28} />, label: "Alertes" },
  ];

  const dontShowNav = ["/login", "/register", "/error", "/404","rest-password","forgot-password",];
  const shouldHide = dontShowNav.some(path => pathname.includes(path))

  if(shouldHide) return null

  return (
    <div className="lg:hidden bg-background py-2 px-4 flex items-center justify-evenly fixed bottom-0 w-full z-50 rounded-t-2xl border-t">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname===href;

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
              isActive ? "bg-primary/10 text-primary scale-105" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {React.cloneElement(icon, {
              className: "mb-1",
              strokeWidth: 2,
            })}
            <span className="text-xs">{label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default PhoneNavBar;
