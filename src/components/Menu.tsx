import { useState, useMemo, useRef } from 'react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';
import { Search, Flame, Sparkles, Clock, Plus, Check, Leaf } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface MenuCardProps {
  key?: string;
  item: MenuItem;
  qty: number;
  onAddItemToCart: (item: MenuItem) => void;
}

function MenuCard({ item, qty, onAddItemToCart }: MenuCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Scale from 1.14 down to 1.02 as we scroll past (smooth subtle zoom)
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.02]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
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
    <motion.div
      ref={cardRef}
      layout
      variants={cardVariants}
      className="group bg-white rounded-xl border border-stone-200/80 hover:border-amber-700/30 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"
      id={`menu-card-${item.id}`}
    >
      {/* Item Thumbnail */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <motion.img
          src={item.image}
          alt={item.name}
          style={{ scale: imageScale }}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />
        
        {/* Popular ribbon */}
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold px-2 py-1 rounded shadow-sm tracking-wide flex items-center gap-1">
            <Sparkles size={11} />
            <span>CHEF'S FAVORITE</span>
          </div>
        )}

        {/* Prep time badge */}
        {item.preparationTime && (
          <div className="absolute bottom-3 right-3 bg-stone-900/70 text-stone-50 backdrop-blur-sm text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1">
            <Clock size={11} />
            <span>{item.preparationTime}</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title and price header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-amber-800 transition-colors">
              {item.name}
            </h3>
            <span className="font-mono text-base font-semibold text-amber-800 shrink-0">
              Rs. {item.price.toLocaleString()}
            </span>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-xs leading-relaxed font-light mb-4">
            {item.description}
          </p>
        </div>

        {/* Dietary markers and Add button */}
        <div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {item.dietary.map(dt => (
              <span 
                key={dt} 
                className="text-[10px] font-mono capitalize px-2 py-0.5 bg-stone-100 text-stone-500 rounded"
              >
                {dt.replace('-', ' ')}
              </span>
            ))}
          </div>

          {/* Add button trigger */}
          <button
            onClick={() => onAddItemToCart(item)}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-200 ${
              qty > 0
                ? 'bg-stone-900 text-white hover:bg-stone-800'
                : 'bg-stone-100 text-stone-800 hover:bg-amber-700 hover:text-white'
            }`}
            id={`btn-add-item-${item.id}`}
          >
            {qty > 0 ? (
              <>
                <Check size={14} className="text-green-400" />
                <span>Added to Order ({qty})</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add to Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface MenuProps {
  onAddItemToCart: (item: MenuItem) => void;
  cartItems: CartItem[];
}

type CategoryFilter = 'all' | 'starters' | 'mains' | 'desserts' | 'drinks';

export default function Menu({ onAddItemToCart, cartItems }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'All Plates', value: 'all' },
    { label: 'Hors d’oeuvres', value: 'starters' },
    { label: 'Mains', value: 'mains' },
    { label: 'Desserts', value: 'desserts' },
    { label: 'Craft Beverages', value: 'drinks' },
  ];

  const dietaryToggles = [
    { label: 'Vegetarian 🌱', value: 'vegetarian' },
    { label: 'Vegan 🌿', value: 'vegan' },
    { label: 'Gluten-Free 🌾', value: 'gluten-free' },
    { label: 'Nut-Free 🥜❌', value: 'nut-free' },
    { label: 'Spicy 🌶️', value: 'spicy' },
  ];

  const handleDietaryToggle = (value: string) => {
    setSelectedDietary(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Filter items based on category, search, and dietary criteria
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category Match
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search Match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) {
          return false;
        }
      }
      // Dietary Match (ALL selected constraints must match)
      if (selectedDietary.length > 0) {
        const matchesAllDietary = selectedDietary.every(d => item.dietary.includes(d as any));
        if (!matchesAllDietary) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery, selectedDietary]);

  // Helper to count how many of a certain item is in the cart
  const getItemQuantity = (id: string) => {
    return cartItems.find(item => item.menuItem.id === id)?.quantity || 0;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-stone-50 text-stone-900 border-t border-stone-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium font-mono uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Seasonal Selection</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 tracking-tight mb-4">
            Curated Culinary Creations
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto font-light">
            Indulge in our exquisite modern bistro selection, inspired by rustic french kitchens and updated with premium local produce.
          </p>
        </motion.div>

        {/* Filters and Search Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-stone-100/60 p-6 rounded-xl border border-stone-200 shadow-sm mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center mb-6">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto scrollbar-hide overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all ${
                    activeCategory === cat.value
                      ? 'bg-stone-900 text-stone-50 shadow-sm'
                      : 'bg-white hover:bg-stone-200 text-stone-600 border border-stone-200/80 hover:text-stone-900'
                  }`}
                  id={`cat-tab-${cat.value}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Text Search Box */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Search delicate flavours..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm transition focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                id="search-menu-input"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            </div>

          </div>

          {/* Dietary filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-stone-200/60">
            <span className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider">
              Filter Dietary:
            </span>
            <div className="flex flex-wrap gap-2">
              {dietaryToggles.map(diet => {
                const isActive = selectedDietary.includes(diet.value);
                return (
                  <button
                    key={diet.value}
                    onClick={() => handleDietaryToggle(diet.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-amber-700 border-amber-700 text-white shadow-sm'
                        : 'bg-white border-stone-300/80 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                    id={`dietary-filter-${diet.value}`}
                  >
                    {diet.label}
                  </button>
                );
              })}
              {selectedDietary.length > 0 && (
                <button
                  onClick={() => setSelectedDietary([])}
                  className="px-3 py-1.5 text-xs font-medium text-amber-800 hover:text-amber-950 underline transition"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Live Menu Items Grid */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length > 0 ? (
            <motion.div
              layout
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              id="menu-items-grid"
            >
              {filteredItems.map((item) => {
                const qty = getItemQuantity(item.id);
                return (
                  <MenuCard
                    key={item.id}
                    item={item}
                    qty={qty}
                    onAddItemToCart={onAddItemToCart}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-stone-100 rounded-xl border border-dashed border-stone-300"
              id="menu-empty-state"
            >
              <div className="max-w-xs mx-auto">
                <Leaf className="mx-auto text-stone-400 mb-3" size={32} />
                <h4 className="font-serif text-lg font-medium text-stone-800 mb-1">No delicacies match</h4>
                <p className="text-stone-500 text-xs font-light">
                  Try tweaking your category, typing a different flavor description, or resetting active dietary filters.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                    setSelectedDietary([]);
                  }}
                  className="mt-4 px-4 py-2 bg-stone-950 text-stone-50 rounded-lg text-xs font-medium hover:bg-stone-800 transition"
                >
                  Reset all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
