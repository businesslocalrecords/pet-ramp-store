import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface TrustItem {
  icon: React.ElementType;
  title: string;
  desc: string;
}

const items: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: '30-Day Risk-Free Trial',
    desc: 'Test it out with your dog in your own car — no questions asked.',
  },
  {
    icon: Truck,
    title: 'Express Insured Shipping',
    desc: 'Directly from our domestic fulfillment centers, fully insured.',
  },
  {
    icon: RotateCcw,
    title: 'Hassle-Free Returns',
    desc: 'Easy prepaid return labels if you decide it is not the right fit.',
  },
];

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-12 px-4 md:px-8 bg-stone-900 text-stone-100">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-6 rounded-xl bg-stone-800/50 border border-stone-800 hover:border-stone-700 transition-colors"
          >
            <item.icon className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-stone-400 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};