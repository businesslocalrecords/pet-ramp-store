import React from 'react';
import { Check, X, Minus } from 'lucide-react';

type CellValue = boolean | string;

interface Row {
  feature: string;
  pawgrip: CellValue;
  jumping: CellValue;
  lifting: CellValue;
}

const rows: Row[] = [
  { feature: 'Protects joints & hips', pawgrip: true, jumping: false, lifting: 'partial' },
  { feature: 'Prevents back strain on owner', pawgrip: true, jumping: true, lifting: false },
  { feature: 'Works for dogs with arthritis', pawgrip: true, jumping: false, lifting: 'partial' },
  { feature: 'Safe for dogs up to 250 lbs', pawgrip: true, jumping: false, lifting: 'partial' },
  { feature: 'No physical effort required', pawgrip: true, jumping: false, lifting: false },
  { feature: 'Folds flat for storage', pawgrip: true, jumping: true, lifting: true },
  { feature: 'One-time cost', pawgrip: true, jumping: true, lifting: true },
  { feature: 'Works for every vehicle type', pawgrip: true, jumping: 'partial', lifting: 'partial' },
];

const CellIcon: React.FC<{ value: CellValue }> = ({ value }) => {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">
        <Check className="w-5 h-5 text-emerald-700" strokeWidth={3} />
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
        <Minus className="w-5 h-5 text-amber-700" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
      <X className="w-5 h-5 text-red-700" strokeWidth={3} />
    </span>
  );
};

export const ComparisonTable: React.FC = () => {
  return (
    <section id="compare" className="py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-stone-50 to-white text-stone-900 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-stone-900 text-amber-400">
            The Safer Alternative
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Why Beating the Alternatives
            <br />
            Is a Ramp, Not a Rescue
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            Veterinarians agree: repeated jumping is the leading cause of joint
            deterioration in dogs. Lifting is the leading cause of owner injury.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border-2 border-stone-900 shadow-[8px_8px_0px_0px_rgba(28,25,23,1)]">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-900 text-stone-100">
                <th className="text-left px-5 py-4 text-sm font-bold">Feature</th>
                <th className="px-3 py-4 text-center">
                  <span className="inline-flex flex-col items-center">
                    <span className="text-sm font-bold text-amber-400">PawGrip Pro</span>
                    <span className="text-[10px] text-stone-400 font-medium">recommended</span>
                  </span>
                </th>
                <th className="px-3 py-4 text-center text-sm font-bold">Letting Them Jump</th>
                <th className="px-3 py-4 text-center text-sm font-bold">Lifting Manually</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-stone-200 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60'
                  } hover:bg-amber-50/40`}
                >
                  <td className="px-5 py-4 text-sm font-medium text-stone-800">{row.feature}</td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <CellIcon value={row.pawgrip} />
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <CellIcon value={row.jumping} />
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-center">
                      <CellIcon value={row.lifting} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-stone-600">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
              <Check className="w-3.5 h-3.5 text-emerald-700" strokeWidth={3} />
            </span>
            Fully solves
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100">
              <Minus className="w-3.5 h-3.5 text-amber-700" strokeWidth={3} />
            </span>
            Partially helps
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
              <X className="w-3.5 h-3.5 text-red-700" strokeWidth={3} />
            </span>
            Does not solve
          </span>
        </div>

        {/* CTA under table */}
        <div className="mt-10 text-center">
          <a
            href="#offer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Choose My Size & Save
          </a>
        </div>
      </div>
    </section>
  );
};