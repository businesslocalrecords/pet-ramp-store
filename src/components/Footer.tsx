import React from 'react';
import { PawPrint, Mail, Camera, Globe, Play, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const linkGroups = [
  {
    title: 'Product',
    links: [
      { label: 'How It Works', href: '#video' },
      { label: 'Size Guide', href: '#size-guide' },
      { label: 'Compare Alternatives', href: '#compare' },
      { label: 'Reviews', href: '#reviews' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Shipping & Returns', href: '#shipping' },
      { label: 'Track My Order', href: '#' },
      { label: 'Contact Us', href: 'mailto:support@pawgrippro.com' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '#' },
      { label: 'Warranty', href: '#shipping' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400">
      {/* Final CTA band */}
      <div className="border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Give Your Dog a Pain-Free Ride
          </h2>
          <p className="mt-3 text-stone-400 max-w-xl mx-auto">
            Join 12,000+ owners who stopped lifting their dogs into the car.
            30-day risk-free trial, free shipping, free returns.
          </p>
          <a
            href="#offer"
            className="mt-7 inline-flex items-center gap-2 px-9 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get the PawGrip Pro — Save 25%
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-stone-900" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">PawGrip Pro</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Veterinary-designed dog car ramps built for senior dogs, large breeds, and owners
              who are done hurting their backs. Shipped from the USA.
            </p>

            {/* Trust icons */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" /> Free insured shipping
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-500" /> 30-day returns
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> 1-year warranty
              </span>
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[Camera, Globe, Play].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-9 h-9 rounded-full bg-stone-900 hover:bg-amber-500 hover:text-stone-900 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-white font-bold text-sm mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-sm hover:text-amber-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {CURRENT_YEAR} PawGrip Pro. All rights reserved.</p>
          <a
            href="mailto:support@pawgrippro.com"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> support@pawgrippro.com
          </a>
        </div>
      </div>
    </footer>
  );
};