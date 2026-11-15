export type MenuCategory =
  | 'All'
  | 'Coffee & Matcha'
  | 'Cold Refreshers'
  | 'Bagels & Savories'
  | 'Sweet Treats';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  pricePkr: number;
  prepTime: string;
  description: string;
  image?: string;
  highlightNote?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  badge: string;
  timeframe: string;
  rating: number;
  comment: string;
  orderedItems: string[];
  ownerReply?: {
    text: string;
    timeframe: string;
  };
}

export interface PopularHourSlot {
  label: string;
  level: number; // 0 to 100
  note: string;
}

export const CAFE_INFO = {
  name: 'Caffido',
  rating: 4.7,
  reviewCount: 32,
  priceRange: 'Rs 1–2,000 per person',
  addressLine1: 'Shop W-13, Eastern Pride',
  addressLine2: 'Block 15 Gulistan-e-Johar, Karachi, 75290',
  fullAddress:
    'Shop W-13, Eastern Pride, Block 15 Gulistan-e-Johar, Karachi, 75290, Pakistan',
  plusCode: 'W47G+7G Gulistan-e-Johar, Karachi',
  phone: '+92 336 2223431',
  phoneHref: 'tel:+923362223431',
  whatsappHref: 'https://wa.me/923362223431',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Caffido+Shop+W-13+Eastern+Pride+Block+15+Gulistan-e-Johar+Karachi',
  foodpandaHref: 'https://www.foodpanda.pk/',
  hoursSummary: 'Open Daily · Closes 2:00 AM',
  hoursDetailed: 'Monday – Sunday · 12:00 PM – 2:00 AM',
  services: ['Dine-in', 'Takeout', 'Delivery'],
  heroImage: '/src/assets/images/hero_caffido_interior_1794730274296.jpg',
};

export const MENU_CATEGORIES: MenuCategory[] = [
  'All',
  'Coffee & Matcha',
  'Cold Refreshers',
  'Bagels & Savories',
  'Sweet Treats',
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'mango-matcha',
    name: 'Iced Mango Matcha',
    category: 'Coffee & Matcha',
    pricePkr: 950,
    prepTime: '5 min',
    description:
      'Ceremonial-grade green matcha whisked over chilled milk and layered with velvety golden mango puree.',
    image: '/src/assets/images/menu_mango_matcha_1794730274972.jpg',
    highlightNote: 'Guest Favorite',
  },
  {
    id: 'iced-latte',
    name: 'Signature Iced Latte',
    category: 'Coffee & Matcha',
    pricePkr: 780,
    prepTime: '4 min',
    description:
      'Double shot of medium-dark house espresso poured over crystal ice and textured cold milk.',
    image: '/src/assets/images/menu_iced_latte_1794730274635.jpg',
    highlightNote: 'House Espresso',
  },
  {
    id: 'grilled-chicken-croissant',
    name: 'Grilled Chicken Croissant',
    category: 'Bagels & Savories',
    pricePkr: 1180,
    prepTime: '10 min',
    description:
      'Warm, flaky butter croissant filled with herb-grilled chicken, melted cheddar, rocket leaves, and house aioli.',
    image: '/src/assets/images/menu_grilled_croissant_1794730274628.jpg',
    highlightNote: 'Menu Highlight',
  },
  {
    id: 'chicken-cheese-bagel',
    name: 'Chicken Cheese Bagel',
    category: 'Bagels & Savories',
    pricePkr: 1090,
    prepTime: '9 min',
    description:
      'Toasted sesame bagel layered with tender pulled chicken, aged melted cheese, crisp greens, and garlic mayo.',
    image: '/src/assets/images/menu_chicken_bagel_1794730274999.jpg',
    highlightNote: 'Most Mentioned',
  },
  {
    id: 'fudge-brownie',
    name: 'Chocolate Fudge Brownie',
    category: 'Sweet Treats',
    pricePkr: 690,
    prepTime: '3 min',
    description:
      'Dense, warm dark cocoa brownie finished with a glossy warm chocolate syrup drizzle and flaky sea salt.',
    image: '/src/assets/images/menu_fudge_brownie_1794730276292.jpg',
    highlightNote: 'Menu Highlight',
  },
  {
    id: 'peach-iced-tea',
    name: 'Chilled Peach Iced Tea',
    category: 'Cold Refreshers',
    pricePkr: 650,
    prepTime: '4 min',
    description:
      'Slow-steeped black tea shaken with sun-ripened peach nectar, fresh mint, and crushed ice.',
    image: '/src/assets/images/menu_chicken_bagel_1794730274999.jpg',
    highlightNote: 'Refreshing',
  },
  {
    id: 'strawberry-shake',
    name: 'Classic Strawberry Shake',
    category: 'Cold Refreshers',
    pricePkr: 820,
    prepTime: '5 min',
    description:
      'Thick, creamy hand-spun milkshake blended with fresh strawberries and Madagascar vanilla cream.',
    image: '/src/assets/images/menu_mango_matcha_1794730274972.jpg',
    highlightNote: '10/10 Rated',
  },
  {
    id: 'club-sandwich',
    name: 'Toasted Club Sandwich',
    category: 'Bagels & Savories',
    pricePkr: 1250,
    prepTime: '12 min',
    description:
      'Triple-decker toasted brioche with smoked chicken, fried egg, cheddar, crisp lettuce, and seasoned fries.',
    image: '/src/assets/images/menu_grilled_croissant_1794730274628.jpg',
  },
  {
    id: 'grilled-chicken-wrap',
    name: 'Herb Chicken Tortilla Wrap',
    category: 'Bagels & Savories',
    pricePkr: 980,
    prepTime: '8 min',
    description:
      'Char-grilled chicken strips, pickled jalapeños, charred bell peppers, and smoky garlic sauce in a pressed wrap.',
    image: '/src/assets/images/menu_chicken_bagel_1794730274999.jpg',
  },
  {
    id: 'spanish-latte',
    name: 'Velvet Spanish Latte',
    category: 'Coffee & Matcha',
    pricePkr: 850,
    prepTime: '4 min',
    description:
      'Rich double espresso balanced with sweetened condensed milk and silky microfoam, served hot or iced.',
    image: '/src/assets/images/menu_iced_latte_1794730274635.jpg',
  },
  {
    id: 'espresso-americano',
    name: 'Single-Origin Americano',
    category: 'Coffee & Matcha',
    pricePkr: 560,
    prepTime: '3 min',
    description:
      'Clean, aromatic double espresso pulled long over filtered water with toasted hazelnut and dark cocoa notes.',
    image: '/src/assets/images/menu_fudge_brownie_1794730276292.jpg',
  },
];

export const POPULAR_TIMES_BY_DAY: Record<string, PopularHourSlot[]> = {
  Sundays: [
    { label: '12p', level: 28, note: 'Quiet midday opening' },
    { label: '3p', level: 42, note: 'Calm afternoon study & coffee' },
    { label: '6p', level: 68, note: 'Evening coffee crowd arrives' },
    { label: '9p', level: 92, note: 'Peak small gatherings' },
    { label: '12a', level: 74, note: 'Late-night Johar hangout' },
  ],
  Weekdays: [
    { label: '12p', level: 22, note: 'Peaceful for remote work' },
    { label: '3p', level: 36, note: 'Light afternoon footfall' },
    { label: '6p', level: 58, note: 'Post-work coffee & bagels' },
    { label: '9p', level: 78, note: 'Lively evening tables' },
    { label: '12a', level: 52, note: 'Relaxed midnight wind-down' },
  ],
  Saturdays: [
    { label: '12p', level: 30, note: 'Easy brunch seating' },
    { label: '3p', level: 48, note: 'Steady afternoon pace' },
    { label: '6p', level: 75, note: 'Busy golden hour tables' },
    { label: '9p', level: 96, note: 'Full house — reserve ahead' },
    { label: '12a', level: 82, note: 'Vibrant late-night vibe' },
  ],
};

export const REVIEWS: ReviewItem[] = [
  {
    id: 'fatima',
    author: 'Fatima',
    badge: 'Local Guide · 17 reviews',
    timeframe: '5 months ago',
    rating: 5,
    comment:
      'I visited Caffido and it is such an aesthetic coffee spot in Johar. The ambience is peaceful and really well-designed, and the staff is very nice. I tried the mango matcha, wrap, and fudge brownie and everything was really great. Overall, great food and great vibes. Would definitely visit again.',
    orderedItems: ['Mango Matcha', 'Chicken Wrap', 'Fudge Brownie'],
    ownerReply: {
      text: 'Thank you Fatima',
      timeframe: '4 months ago',
    },
  },
  {
    id: 'saman',
    author: 'Saman Haseeb',
    badge: 'Local Guide · 255 reviews',
    timeframe: '3 months ago',
    rating: 5,
    comment:
      'A good coffee place in Gulistan-e-Johar, a quiet and pleasant place for small gatherings. They have some sweet options too for snacking. Loved their coffee and iced latte and prices are average — not too high, not too low, but worth the money.',
    orderedItems: ['House Coffee', 'Iced Latte'],
    ownerReply: {
      text: 'Thank you Saman',
      timeframe: '3 months ago',
    },
  },
  {
    id: 'kinza',
    author: 'Kinza Bilal',
    badge: 'Local Guide · 15 reviews',
    timeframe: '3 months ago',
    rating: 5,
    comment:
      'Cute vibes, good food & even better drinks. The Strawberry Shake was a 10/10, the Peach Iced Tea was super refreshing, and the Chicken Cheese Bagel hit the spot.',
    orderedItems: ['Strawberry Shake', 'Peach Iced Tea', 'Chicken Cheese Bagel'],
  },
];
