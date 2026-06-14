import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChefHat, CalendarDays, ArrowDown } from 'lucide-react';

interface HeroProps {
  onNavigateToMenu: () => void;
  onNavigateToReservations: () => void;
}

export default function Hero({ onNavigateToMenu, onNavigateToReservations }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Zoom background slightly as we scroll down, and pan down
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <header ref={containerRef} className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background Image with warm overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1585938338392-50a59970d2ee?auto=format&fit=crop&w=1600&q=80"
          alt="Cafe Muzamil Fine Desi Dining"
          style={{ scale, y }}
          className="w-full h-full object-cover opacity-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 mb-4"
        >
          <span className="h-[1px] w-12 bg-amber-500/80"></span>
          <span className="text-amber-500 uppercase tracking-[0.3em] font-mono text-xs font-semibold">
            ESTABLISHED 2018
          </span>
          <span className="h-[1px] w-12 bg-amber-500/80"></span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-serif text-amber-50/95 tracking-tight mb-6 leading-tight"
          id="hero-title"
        >
          Cafe Muzamil <span className="font-sans font-light italic text-amber-100/70">Dining</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-stone-300 text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-10 tracking-wide"
        >
          Crafting moments where traditional South Asian culinary heritage meets premium, hand-picked ingredients. Indulge your senses in our aromatic, candlelit dining hall.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onNavigateToMenu}
            className="group px-8 py-4 bg-amber-700 hover:bg-amber-800 text-stone-50 font-medium rounded-md flex items-center justify-center gap-2 transition duration-300 shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            id="hero-menu-cta"
          >
            <ChefHat size={18} className="text-amber-200 transition-transform group-hover:rotate-12" />
            <span>Explore Menu</span>
          </button>

          <button
            onClick={onNavigateToReservations}
            className="px-8 py-4 bg-transparent border border-stone-600 hover:border-amber-500/50 hover:bg-stone-900/60 text-stone-100 font-medium rounded-md flex items-center justify-center gap-2 transition duration-300 backdrop-blur-sm transform hover:-translate-y-0.5 active:translate-y-0"
            id="hero-reserve-cta"
          >
            <CalendarDays size={18} className="text-stone-400" />
            <span>Book a Table</span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-[-10vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={onNavigateToMenu}
        >
          <span className="text-[10px] text-stone-500 font-mono tracking-[0.2em] uppercase">Scroll</span>
          <ArrowDown size={14} className="text-stone-500" />
        </motion.div>
      </div>
    </header>
  );
}
