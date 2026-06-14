import { MenuItem, FeedbackReview } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // --- STARTERS ---
  {
    id: 's1',
    name: 'Samosa Chaat',
    description: 'Crispy pastry stuffed with spiced potatoes and peas, crushed and topped with warm chickpea curry, sweetened yogurt, tamarind, and mint-coriander chutneys.',
    price: 380,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'spicy'],
    isPopular: true,
    preparationTime: '8 mins'
  },
  {
    id: 's2',
    name: 'Tandoori Chicken Tikka',
    description: 'Tender boneless chicken breast chunks marinated in yogurt, Kashmiri red chilies, and hand-ground spices, roasted in a traditional clay tandoor.',
    price: 750,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    dietary: ['gluten-free', 'nut-free', 'spicy'],
    isPopular: true,
    preparationTime: '12 mins'
  },
  {
    id: 's3',
    name: 'Crispy Vegetable Pakoras',
    description: 'Fresh spinach, onions, and potatoes mixed in spiced chickpea batter, fried to a golden crispness, served with tangy mint chutney.',
    price: 350,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'vegan', 'gluten-free', 'nut-free'],
    isPopular: false,
    preparationTime: '7 mins'
  },

  // --- MAINS ---
  {
    id: 'm1',
    name: 'Royal Mutton Biryani',
    description: 'Aromatic long-grain Basmati rice layered with succulent pieces of mutton, slow-cooked in a sealed pot (Dum style) with saffron, rose water, and caramelized onions.',
    price: 1450,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80',
    dietary: ['spicy', 'gluten-free'],
    isPopular: true,
    preparationTime: '20 mins'
  },
  {
    id: 'm2',
    name: 'Classic Butter Chicken',
    description: 'Tandoori grilled chicken tikka simmered in a velvety, rich tomato, cashew nut, and butter sauce, lightly sweetened and finished with dried fenugreek leaves.',
    price: 1250,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    dietary: ['gluten-free'],
    isPopular: true,
    preparationTime: '15 mins'
  },
  {
    id: 'm3',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cubes of cottage cheese sauteed with bell peppers and onions in a spiced onion-tomato gravy with fresh cream.',
    price: 950,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'gluten-free'],
    isPopular: false,
    preparationTime: '14 mins'
  },
  {
    id: 'm4',
    name: 'Lahori Chana Masala',
    description: 'Soft chickpeas cooked in a fragrant onion-tomato gravy with traditional Lahori spices, ginger juliennes, and fresh green chilies.',
    price: 650,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'vegan', 'gluten-free', 'nut-free', 'spicy'],
    isPopular: false,
    preparationTime: '10 mins'
  },

  // --- DESSERTS ---
  {
    id: 'd1',
    name: 'Hot Gulab Jamun',
    description: 'Warm milk-solid dumplings, deep-fried to a golden brown and soaked in a sweet sugar syrup perfumed with cardamom and rose water.',
    price: 300,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'nut-free'],
    isPopular: true,
    preparationTime: '5 mins'
  },
  {
    id: 'd2',
    name: 'Mango Kulfi',
    description: 'Traditional slow-churned Indian ice cream infused with rich Alphonso mango pulp, green cardamom, and garnished with chopped pistachios.',
    price: 350,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'gluten-free'],
    isPopular: true,
    preparationTime: '8 mins'
  },
  {
    id: 'd3',
    name: 'Zafrani Shahi Tukda',
    description: 'Crispy fried bread slices soaked in cardamom saffron rabri (thickened sweet milk) and topped with silver leaf and sliced almonds.',
    price: 450,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian'],
    isPopular: false,
    preparationTime: '10 mins'
  },

  // --- DRINKS ---
  {
    id: 'dr1',
    name: 'Mango Lassi',
    description: 'A creamy, refreshing yogurt drink blended with fresh sweet mango pulp, milk, and a touch of cardamom.',
    price: 280,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'gluten-free', 'nut-free'],
    isPopular: true,
    preparationTime: '4 mins'
  },
  {
    id: 'dr2',
    name: 'Peshawari Karak Chai',
    description: 'Rich, strong milk tea slow-brewed on fire with black tea leaves, crushed ginger, cardamom, and caramelized sugar.',
    price: 180,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'gluten-free', 'nut-free'],
    isPopular: true,
    preparationTime: '6 mins'
  },
  {
    id: 'dr3',
    name: 'Fresh Mint Margarita',
    description: 'Pakistani-style refreshing iced drink blended with fresh mint leaves, lime juice, black salt, and sparkling water.',
    price: 250,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    dietary: ['vegetarian', 'vegan', 'gluten-free', 'nut-free'],
    isPopular: false,
    preparationTime: '3 mins'
  }
];

export const REVIEWS: FeedbackReview[] = [
  {
    id: 'r1',
    name: 'Ayesha Khan',
    rating: 5,
    comment: 'Cafe Muzamil has truly become my favorite dining spot. The Royal Mutton Biryani is incredibly flavorful, and the warm hospitality makes every visit special. Remarkable experience!',
    date: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'r2',
    name: 'Suhail Ahmed',
    rating: 5,
    comment: 'The Butter Chicken is rich, creamy, and seasoned to perfection. Pairing it with hot Garlic Naan and finishing with Peshawari Karak Chai is an absolute must. Highly recommended!',
    date: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'r3',
    name: 'Zainab Malik',
    rating: 5,
    comment: 'Perfect place for family dinners. Booking a table was effortless, and the outdoor patio setting is beautiful. The Samosa Chaat and Gulab Jamun were phenomenal!',
    date: '2 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  }
];
