import React from 'react';
import { Play } from 'lucide-react';

/**
 * Video proof section: customer demo of the ramp in action.
 *
 * Asset: place demo-video.mp4 in public/assets/ and it will play here.
 * A poster placeholder is shown while loading / if no video file is present.
 */
export const VideoProof: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-stone-900 text-stone-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-100 text-amber-800">
            <Play className="w-3.5 h-3.5" /> Social Proof
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Watch It In Action</h2>
          <p className="text-stone-400 max-w-xl mx-auto">
            See how easy it is for dogs of every size to use our ramps — real
            customers, real dogs, no script.
          </p>
        </div>

        <div className="relative aspect-video bg-stone-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          <video
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            poster="/assets/poster-placeholder.svg"
            src="/assets/demo-video.mp4"
          >
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-stone-500 mt-4">
          Video: public/assets/demo-video.mp4 &middot; Poster: public/assets/poster-placeholder.svg
        </p>
      </div>
    </section>
  );
};