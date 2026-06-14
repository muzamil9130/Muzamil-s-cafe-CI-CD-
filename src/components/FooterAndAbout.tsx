import { useRef } from 'react';
import { FeedbackReview } from '../types';
import { REVIEWS } from '../data/menu';
import { Star, Clock, HelpCircle, Phone, Compass, ArrowUp } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface FooterAndAboutProps {
  onScrollToTop: () => void;
}

export default function FooterAndAbout({ onScrollToTop }: FooterAndAboutProps) {
  const ratings = [5, 5, 5]; // Precompiled score ratings
  const chefSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: chefScrollY } = useScroll({
    target: chefSectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect: translate vertical position slightly slower than scroll
  const chefImageY = useTransform(chefScrollY, [0, 1], ["-10%", "10%"]);

  const reviewsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const reviewCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  return (
    <footer className="bg-stone-950 text-stone-300 font-sans border-t border-stone-850">
      
      {/* 1. Dining Philosophy page section */}
      <div ref={chefSectionRef} className="py-20 px-4 md:px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.3em] font-semibold block mb-2">
            Chef’s Kitchen Manifesto
          </span>
          <h3 className="text-3xl md:text-4xl font-serif text-white tracking-tight mb-6">
            Where Raw Ingredients Meet Sincere Technique
          </h3>
          <div className="space-y-4 font-light text-stone-400 text-sm leading-relaxed">
            <p>
              Under the culinary stewardship of Executive Chef Muzamil Ahmed, our kitchen team commits to a simple, unyielding discipline: respect the traditions, cook with open flame, and celebrate the natural depth of pure spices. 
            </p>
            <p>
              Every curry starts from slow-roasted whole spices, every herb is harvested fresh from local organic farms at dawn, and all ingredients are sourced with care to preserve authentic taste.
            </p>
            <p>
              We believe a dining table is a sacred circle of restoration, conversation, and presence. We invite you to sit back, let go of the clocks, and savor the slow pacing of a traditional meal.
            </p>
          </div>

          <div className="flex gap-8 mt-8 border-t border-stone-900 pt-6 font-mono text-xs">
            <div>
              <span className="text-amber-400 font-bold block text-lg">98%</span>
              <span className="text-stone-500 uppercase tracking-tight text-[10px]">LOCAL INGREDIENTS</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block text-lg">40+</span>
              <span className="text-stone-500 uppercase tracking-tight text-[10px]">CRAFTED LABELS</span>
            </div>
            <div>
              <span className="text-amber-400 font-bold block text-lg">24</span>
              <span className="text-stone-500 uppercase tracking-tight text-[10px]">TOTAL DINING SEATS</span>
            </div>
          </div>
        </motion.div>

        {/* Cinematic portrait banner placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl bg-stone-900"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
            alt="Chef cooking with passion"
            style={{ y: chefImageY }}
            className="w-full h-[120%] absolute -top-[10%] left-0 object-cover opacity-60 hover:scale-[1.03] transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-amber-500 font-mono text-[9px] uppercase tracking-wider block mb-1">
              THE MANIFESTO
            </span>
            <p className="font-serif text-white text-base italic leading-relaxed">
              "Desi cooking is an art of patience—balancing fire, hand-ground spices, and spirit to create a soulful feast."
            </p>
            <span className="text-stone-400 text-xs mt-2 block font-sans">— Chef Muzamil Ahmed</span>
          </div>
        </motion.div>
      </div>

      {/* 2. Feedback Testimonial block */}
      <div className="bg-stone-900/40 py-16 px-4 md:px-8 border-t border-b border-stone-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <span className="text-amber-500 font-mono text-[10px] tracking-[0.2em] uppercase">Verified Guest Feedback</span>
            <h4 className="text-2xl font-serif text-white mt-1">Honest Words from Our Guests</h4>
          </motion.div>

          <motion.div
            variants={reviewsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            id="reviews-bento-grid"
          >
            {REVIEWS.map((review) => (
              <motion.div
                key={review.id}
                variants={reviewCardVariants}
                className="bg-stone-950/70 rounded-xl p-6 border border-stone-850 flex flex-col justify-between"
                id={`review-card-${review.id}`}
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-stone-300 font-light text-xs leading-relaxed italic mb-6">
                    "{review.comment}"
                  </p>
                </div>

                {/* Profile Avatar */}
                <div className="flex items-center gap-3 border-t border-stone-900 pt-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 object-cover rounded-full border border-stone-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-stone-200 font-serif text-xs font-semibold">{review.name}</h5>
                    <span className="text-stone-500 font-mono text-[9px] tracking-tight block">
                      {review.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 3. Schedule, Hours & Contact Coordinates */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="py-16 px-4 md:px-8 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 text-sm font-light"
      >
        
        {/* Short info section (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-lg font-serif text-white tracking-tight leading-snug">
            Cafe Muzamil
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed">
            Delivering fine contemporary South Asian dining within a highly intimate, authentic Haveli-inspired structure. Private event buyouts are available on select weekend slots.
          </p>
          <div className="pt-3 flex gap-4">
            <a href="#" className="p-2 bg-stone-900 hover:bg-amber-800 hover:text-white rounded-full transition text-stone-400">
              <Compass size={14} />
            </a>
            <a href="#" className="p-2 bg-stone-900 hover:bg-amber-800 hover:text-white rounded-full transition text-stone-400">
              <Phone size={14} />
            </a>
          </div>
        </div>

        {/* Schedule grid (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <h5 className="text-stone-300 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
            <Clock size={13} className="text-amber-500" />
            <span>Weekly Operations Schedule</span>
          </h5>
          <div className="space-y-2 font-mono text-xs text-stone-400">
            <div className="flex justify-between border-b border-stone-900 pb-1.5">
              <span>MONDAY</span>
              <span className="text-right text-stone-500 uppercase">KITCHEN RESTS</span>
            </div>
            <div className="flex justify-between border-b border-stone-900 pb-1.5">
              <span>TUESDAY - THURSDAY</span>
              <span className="text-right text-stone-100">17:00 - 22:30</span>
            </div>
            <div className="flex justify-between border-b border-stone-900 pb-1.5">
              <span>FRIDAY & SATURDAY</span>
              <span className="text-right text-stone-100">12:00 - 23:30</span>
            </div>
            <div className="flex justify-between pb-1.5">
              <span>SUNDAY BRUNCH</span>
              <span className="text-right text-stone-100">11:00 - 16:00</span>
            </div>
          </div>
        </div>

        {/* Quick query list (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <h5 className="text-stone-300 font-serif font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
            <HelpCircle size={13} className="text-amber-500" />
            <span>Corporate Coordinates</span>
          </h5>
          <div className="space-y-3 text-xs">
            <p className="flex items-start gap-2.5">
              <span className="font-mono text-stone-500">ADDR:</span>
              <span className="text-stone-400 leading-normal">
                M2, Block K, Gulberg II, Lahore, Pakistan
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <span className="font-mono text-stone-500">TELE:</span>
              <span className="text-stone-300 font-bold hover:text-amber-400 transition">
                03323222680
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <span className="font-mono text-stone-500">MAIL:</span>
              <span className="text-stone-400 hover:text-amber-400 transition">
                muzamilsoomro@gmail.com
              </span>
            </p>
          </div>
        </div>

      </motion.div>

      {/* 4. Bottom copyright bar with scroll to top trigger */}
      <div className="bg-stone-950 py-6 px-4 md:px-8 border-t border-stone-900 text-xs font-mono text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
        <span>© {new Date().getFullYear()} Cafe Muzamil. Crafted with sincere precision.</span>
        
        <button
          onClick={onScrollToTop}
          className="flex items-center gap-1.5 hover:text-amber-500 transition group py-1 px-3 bg-stone-900 rounded-md border border-stone-850"
          id="btn-scroll-to-top"
          title="Scroll up"
        >
          <span>Top</span>
          <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>

    </footer>
  );
}
