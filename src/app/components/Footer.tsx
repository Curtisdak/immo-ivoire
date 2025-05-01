import Link from 'next/link';
import React from 'react';
import { TooltipLink } from './ToolTipLink';
import { Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-10 w-full">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between bg-card lg:bg-transparent border-2 lg:border-0 p-6 gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-primary">Serik Immo</h2>
          <p className="mt-2 text-muted-foreground">Suivez-nous :</p>
          <div className="flex justify-center lg:justify-start items-center gap-4 mt-4 text-muted-foreground">
            <TooltipLink tiplink="/" content="Youtube" logo={<Youtube size={36} />} />
            <TooltipLink tiplink="/" content="Facebook" logo={<Facebook size={36} />} />
            <TooltipLink tiplink="/" content="Instagram" logo={<Instagram size={36} />} />
          </div>
        </div>

        {/* Serik.Den Section */}
        <div className="text-center text-muted-foreground lg:text-right">
          <p className="text-sm font-semibold mb-2">Created by:</p>
          <Link
            href="/"
            className="hover:underline transition duration-200 text-xl font-bold text-muted-foreground "
          >
            Serik.Dev
          </Link>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-primary text-accent flex flex-col lg:flex-row items-center justify-between p-4">
        <p className="text-center text-sm w-full lg:w-auto">
          © 2025 Serik Immo Côte d&apos;Ivoire · Tous droits réservés
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2 lg:mt-0">
          <Link className="hover:underline text-sm" href="/">
            Mentions légales
          </Link>
          <Link className="hover:underline text-sm" href="/">
            Conditions générales
          </Link>
          <Link className="hover:underline text-sm" href="/">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
