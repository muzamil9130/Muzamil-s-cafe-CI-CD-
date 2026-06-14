export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starters' | 'mains' | 'desserts' | 'drinks';
  image: string;
  dietary: ('vegetarian' | 'vegan' | 'gluten-free' | 'nut-free' | 'spicy')[];
  isPopular?: boolean;
  preparationTime?: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  area: 'main-hall' | 'patio' | 'window-seat' | 'bar';
  name: string;
  email: string;
  phone: string;
  specialRequests?: string;
  createdAt: string;
  reservationCode: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface FeedbackReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}
