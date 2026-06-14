import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChefHat, CalendarDays, Compass, UtensilsCrossed, Phone } from 'lucide-react';
import { MenuItem, CartItem } from './types';
import Lenis from 'lenis';

// Importing Custom Layout Modules
import Hero from './components/Hero';
import Menu from './components/Menu';
import OrderCart from './components/OrderCart';
import ReservationForm from './components/ReservationForm';
import FooterAndAbout from './components/FooterAndAbout';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
    };
  }, []);

  // Monitor Scroll for Navbar transformation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync Cart with localStorage for persistent browser state
  useEffect(() => {
    const savedCart = localStorage.getItem('lam_bistro_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing cart state', e);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('lam_bistro_cart', JSON.stringify(updatedCart));
  };

  // 1. ADD ITEM OR INCREMENT INDIVIDUAL DISH
  const handleAddItemToCart = (item: MenuItem) => {
    const existingIndex = cartItems.findIndex(c => c.menuItem.id === item.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    } else {
      const updated = [...cartItems, { menuItem: item, quantity: 1 }];
      saveCartToStorage(updated);
    }
  };

  // Alternatively handle incrementing by ID
  const handleIncrementById = (id: string) => {
    const existingIndex = cartItems.findIndex(c => c.menuItem.id === id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      saveCartToStorage(updated);
    }
  };

  // 2. DECREMENT DISH QUANTITY
  const handleDecrementItem = (id: string) => {
    const existingIndex = cartItems.findIndex(c => c.menuItem.id === id);
    if (existingIndex === -1) return;

    const updated = [...cartItems];
    if (updated[existingIndex].quantity > 1) {
      updated[existingIndex].quantity -= 1;
      saveCartToStorage(updated);
    } else {
      // If it is 1, completely remove from cart
      handleRemoveItem(id);
    }
  };

  // 3. REMOVE CHOSEN DISH ENTIRELY
  const handleRemoveItem = (id: string) => {
    const updated = cartItems.filter(c => c.menuItem.id !== id);
    saveCartToStorage(updated);
  };

  // 4. CLEAR THE CART COLLECTION
  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Layout Scrolling Helpers
  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.5 });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToReservations = () => {
    const el = document.getElementById('reservations-section');
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.5 });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPhilosophy = () => {
    const el = document.getElementById('philosophy-section');
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { duration: 1.5 });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-stone-50 select-none overflow-x-hidden font-sans scroll-smooth" id="app-root-container">

      {/* 1. Global Navigation Bar Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 p-4 shadow-sm'
          : 'bg-transparent p-6'
          }`}
        id="global-navbar"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo Name */}
          <div
            onClick={scrollToTop}
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo-element"
          >
            <div className="p-1.5 rounded bg-amber-700 text-stone-50 transition-transform group-hover:rotate-12">
              <UtensilsCrossed size={16} />
            </div>
            <span className={`text-lg font-serif tracking-wider transition-colors ${isScrolled ? 'text-stone-900' : 'text-amber-50/95'
              }`}>
              Cafe Muzamil
            </span>
          </div>

          {/* Quick Desktop Link Options */}
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest font-semibold">
            <button
              onClick={scrollToMenu}
              className={`hover:text-amber-600 transition cursor-pointer ${isScrolled ? 'text-stone-600' : 'text-stone-300 hover:text-white'
                }`}
              id="lnk-menu"
            >
              Our Menu
            </button>
            <button
              onClick={scrollToReservations}
              className={`hover:text-amber-600 transition cursor-pointer ${isScrolled ? 'text-stone-600' : 'text-stone-300 hover:text-white'
                }`}
              id="lnk-reservations"
            >
              Table Reservations
            </button>
            <button
              onClick={scrollToPhilosophy}
              className={`hover:text-amber-600 transition cursor-pointer ${isScrolled ? 'text-stone-600' : 'text-stone-300 hover:text-white'
                }`}
              id="lnk-philosophy"
            >
              Our Philosophy
            </button>
          </div>

          {/* User Quick Actions (Shopping Cart Trigger) */}
          <div className="flex items-center gap-4">
            {/* Quick Phone contact reference in navbar */}
            <span className={`hidden lg:flex items-center gap-1 text-[11px] font-mono tracking-tight ${isScrolled ? 'text-stone-500' : 'text-stone-400'
              }`}>
              <Phone size={11} className="text-amber-600" />
              <span>+92 (332) 322-2680</span>
            </span>

            {/* Floating style basket box */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${isScrolled
                ? 'bg-stone-900 border-stone-800 hover:bg-stone-800 text-white shadow-sm'
                : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 text-stone-100 backdrop-blur-sm'
                }`}
              id="navbar-cart-trigger"
              title="Open Gourmet Order"
            >
              <ShoppingBag size={15} />
              <span className="text-xs font-mono font-bold hidden sm:inline">Order</span>

              {/* Dynamic counter badge */}
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-stone-950 font-mono text-[10px] font-bold shadow animate-bounce">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* 2. Visual Cinematic Introduction */}
      <Hero
        onNavigateToMenu={scrollToMenu}
        onNavigateToReservations={scrollToReservations}
      />

      {/* 3. The Gourmet Food and Craft Beverage catalog layout */}
      <div id="menu-section">
        <Menu
          onAddItemToCart={handleAddItemToCart}
          cartItems={cartItems}
        />
      </div>

      {/* 4. The secure table book scheduler component */}
      <div id="reservations-section">
        <ReservationForm />
      </div>

      {/* 5. Master story manifesto and real comments block */}
      <div id="philosophy-section">
        <FooterAndAbout onScrollToTop={scrollToTop} />
      </div>

      {/* 6. Dynamic Slide-Sheet shopping list drawer */}
      <OrderCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onAddItem={handleIncrementById}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onDecrementItem={handleDecrementItem}
      />

      {/* 7. Bottom Sticky Basket trigger widget (displayed only when cart has items) */}
      <AnimatePresence>
        {totalQuantity > 0 && !isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-40 hidden sm:block"
            id="sticky-basket-container"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 px-5 py-3.5 bg-amber-700 hover:bg-amber-800 text-stone-50 font-semibold font-serif text-sm rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-103 cursor-pointer"
              id="sticky-basket-trigger-btn"
            >
              <ShoppingBag size={18} className="animate-pulse" />
              <span>View Kitchen Order ({totalQuantity})</span>
              <span className="font-mono bg-stone-900 text-amber-400 font-bold px-2 py-0.5 rounded-full text-xs">
                Rs. {cartItems.reduce((acc, c) => acc + (c.menuItem.price * c.quantity), 0).toLocaleString()}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
