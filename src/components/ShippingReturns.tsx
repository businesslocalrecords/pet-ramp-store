import React from 'react';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: '1',
    title: 'Order',
    desc: 'Place your order and we ship within 1-2 business days from a domestic warehouse.',
  },
  {
    num: '2',
    title: 'Try It Risk-Free',
    desc: 'Your companion gets up to 30 days to use the ramp in their own car, at zero risk.',
  },
  {
    num: '3',
    title: 'Love It or Return It',
    desc: 'Keep it and enjoy safe, joyful rides forever — or return it for a full refund.',
  },
];

export const ShippingReturns: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white text-stone-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-100 text-amber-800">
            Service
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Shipping & Returns, Completely Sorted
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto">
            Fast, free, and fully insured — every step of the way.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-8 bg-stone-50 rounded-2xl border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-lg shadow">
                {step.num}
              </span>
              <h3 className="text-xl font-bold mt-4 mb-2">{step.title}</h3>
              <p className="text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};