import { Product, Category, Seller, Coupon, Banner, Review, User, Order } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    icon: 'Tv',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    productCount: 142,
    featured: true
  },
  {
    id: 'cat-2',
    name: 'Mobile Phones',
    slug: 'mobile-phones',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    productCount: 88,
    featured: true
  },
  {
    id: 'cat-3',
    name: 'Computers',
    slug: 'computers',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80',
    productCount: 65,
    featured: true
  },
  {
    id: 'cat-4',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
    productCount: 230,
    featured: true
  },
  {
    id: 'cat-5',
    name: "Women's Fashion",
    slug: 'womens-fashion',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    productCount: 310,
    featured: true
  },
  {
    id: 'cat-6',
    name: 'Shoes',
    slug: 'shoes',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    productCount: 115,
    featured: true
  },
  {
    id: 'cat-7',
    name: 'Beauty',
    slug: 'beauty',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
    productCount: 175,
    featured: true
  },
  {
    id: 'cat-8',
    name: 'Home & Living',
    slug: 'home-living',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80',
    productCount: 190,
    featured: true
  },
  {
    id: 'cat-9',
    name: 'Grocery',
    slug: 'grocery',
    icon: 'ShoppingBasket',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
    productCount: 280,
    featured: true
  },
  {
    id: 'cat-10',
    name: 'Sports',
    slug: 'sports',
    icon: 'Dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    productCount: 94,
    featured: true
  },
  {
    id: 'cat-11',
    name: 'Watches',
    slug: 'watches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    productCount: 72,
    featured: true
  },
  {
    id: 'cat-12',
    name: 'Accessories',
    slug: 'accessories',
    icon: 'Glasses',
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=400&q=80',
    productCount: 148,
    featured: true
  }
];

export const MOCK_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    name: 'Apex Footwear Official',
    slug: 'apex-footwear',
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 3840,
    followers: 42100,
    joinedDate: 'Jan 2021',
    verified: true,
    location: 'Dhaka, Bangladesh',
    responseRate: '98%',
    shipOnTime: '99%',
    about: 'Apex Footwear Ltd. is the leading manufacturer and exporter of leather footwear in Bangladesh, bringing authentic style and comfort to millions.'
  },
  {
    id: 'seller-2',
    name: 'Walton Tech Hub',
    slug: 'walton-tech-hub',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
    rating: 4.7,
    reviewCount: 5120,
    followers: 68900,
    joinedDate: 'Nov 2020',
    verified: true,
    location: 'Gazipur, Dhaka',
    responseRate: '96%',
    shipOnTime: '97%',
    about: 'Official premier distributor of genuine Walton electronics, home appliances, smartphones, and computers in Bangladesh.'
  },
  {
    id: 'seller-3',
    name: 'Aarong Artisan Living',
    slug: 'aarong-artisan',
    logo: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    reviewCount: 2790,
    followers: 54300,
    joinedDate: 'Mar 2022',
    verified: true,
    location: 'Gulshan, Dhaka',
    responseRate: '99%',
    shipOnTime: '98%',
    about: 'Crafting fine hand-loomed apparel, Jamdani sarees, Panjabis, and home accents celebrating authentic Bangladeshi heritage.'
  },
  {
    id: 'seller-4',
    name: 'Xiaomi Authorized BD',
    slug: 'xiaomi-authorized-bd',
    logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    reviewCount: 6410,
    followers: 89000,
    joinedDate: 'Feb 2021',
    verified: true,
    location: 'Banani, Dhaka',
    responseRate: '97%',
    shipOnTime: '99%',
    about: '100% genuine Xiaomi smartphones, Redmi series, smart ecosystem devices, power banks, and accessories with official warranty.'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // 1. Mobile Phone - Flash Sale
  {
    id: 'prod-1',
    title: 'Redmi Note 13 Pro 4G (8GB RAM / 256GB ROM) - 200MP Camera Phone',
    description: 'Experience stunning photography with the 200MP ultra-clear main camera, 120Hz AMOLED FHD+ display, 67W turbo fast charging with 5000mAh battery, and powerful MediaTek Helio G99-Ultra processor.',
    category: 'Mobile Phones',
    brand: 'Xiaomi',
    price: 26999,
    originalPrice: 32999,
    discount: 18,
    rating: 4.8,
    reviewCount: 238,
    soldCount: 1420,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['mobile', 'xiaomi', 'redmi', 'smartphone', 'flash-sale'],
    isFlashSale: true,
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Display: '6.67" AMOLED, 120Hz, 1300 nits',
      Processor: 'MediaTek Helio G99-Ultra',
      Camera: '200MP + 8MP + 2MP / 16MP Front',
      Battery: '5000mAh, 67W HyperCharge',
      Warranty: '1 Year Official Brand Warranty'
    },
    warranty: '1 Year Official Brand Warranty',
    deliveryDays: 2
  },

  // 2. Earbuds - Flash Sale
  {
    id: 'prod-2',
    title: 'Anker Soundcore Life P2i True Wireless Earbuds with Bass Boost',
    description: 'Enjoy thumping bass with 10mm drivers, dual EQ modes (Bass & Podcast), crystal-clear calls with AI noise reduction, and up to 28 hours total playtime with rapid USB-C fast charging.',
    category: 'Electronics',
    brand: 'Soundcore',
    price: 2299,
    originalPrice: 3499,
    discount: 34,
    rating: 4.7,
    reviewCount: 489,
    soldCount: 3100,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['earbuds', 'wireless', 'audio', 'anker', 'bluetooth', 'flash-sale'],
    isFlashSale: true,
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Connectivity: 'Bluetooth 5.2',
      'Battery Life': '8h per charge, 28h with case',
      'Water Resistance': 'IPX5 Sweatproof',
      Charging: 'USB-C Fast Charge'
    },
    warranty: '18 Months Official Warranty',
    deliveryDays: 1
  },

  // 3. Smartwatch - Flash Sale
  {
    id: 'prod-3',
    title: 'Amazfit Bip 5 Smartwatch with 1.91" Large HD Display & Bluetooth Call',
    description: 'Ultra-large 1.91" touchscreen display, Bluetooth phone calls with built-in mic and speaker, 120+ sports modes, 24-hour heart rate and SpO2 health monitoring, and 10-day ultra-long battery life.',
    category: 'Watches',
    brand: 'Amazfit',
    price: 5899,
    originalPrice: 7999,
    discount: 26,
    rating: 4.6,
    reviewCount: 164,
    soldCount: 820,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['smartwatch', 'amazfit', 'watch', 'fitness', 'flash-sale'],
    isFlashSale: true,
    isBestSeller: false,
    freeDelivery: true,
    specifications: {
      Display: '1.91" TFT LCD 320x380',
      Sensors: 'BioTracker PPG Heart Rate, SpO2, Sleep',
      Battery: '300mAh, up to 10 days standard usage',
      Compatibility: 'Android 7.0+ and iOS 14.0+'
    },
    warranty: '1 Year Warranty',
    deliveryDays: 2
  },

  // 4. Laptop - Flash Sale
  {
    id: 'prod-4',
    title: 'Walton Prelude N5000 14" Slim Laptop (8GB RAM / 512GB NVMe SSD)',
    description: 'Sleek ultra-portable laptop designed for students, office tasks, and online classes. Features Intel Pentium Silver processor, Full HD anti-glare IPS display, and all-day battery life.',
    category: 'Computers',
    brand: 'Walton',
    price: 32500,
    originalPrice: 38000,
    discount: 14,
    rating: 4.5,
    reviewCount: 92,
    soldCount: 410,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['laptop', 'walton', 'computer', 'student', 'flash-sale'],
    isFlashSale: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Processor: 'Intel Pentium Silver Quad-Core',
      RAM: '8GB DDR4 2400MHz',
      Storage: '512GB M.2 NVMe SSD',
      Screen: '14.0" FHD (1920x1080) Matte IPS'
    },
    warranty: '2 Years Service Warranty',
    deliveryDays: 3
  },

  // 5. Men's Fashion - Panjabi
  {
    id: 'prod-5',
    title: 'Premium Hand-Embroidered Cotton Kabli Panjabi for Men - Deep Navy',
    description: 'Meticulously crafted from 100% premium combed cotton with elegant collar and placket thread embroidery. Perfect for Friday prayers, Eid celebrations, and festive gatherings.',
    category: "Men's Fashion",
    brand: 'Aarong',
    price: 2490,
    originalPrice: 3200,
    discount: 22,
    rating: 4.9,
    reviewCount: 312,
    soldCount: 1980,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['panjabi', 'mens-wear', 'fashion', 'traditional', 'cotton'],
    isFlashSale: true,
    isBestSeller: true,
    isMall: true,
    freeDelivery: false,
    specifications: {
      Fabric: '100% Pure Combed Cotton',
      Cut: 'Classic Fit with side pockets',
      Origin: 'Handcrafted in Bangladesh',
      Care: 'Gentle Machine Wash'
    },
    warranty: '7 Days Replacement',
    deliveryDays: 2
  },

  // 6. Women's Fashion - Saree
  {
    id: 'prod-6',
    title: 'Authentic Dhakai Jamdani Handloom Silk Saree with Zari Weave',
    description: 'Exquisite authentic Dhakai Jamdani saree masterfully handwoven by artisan weavers of Narayanganj. Features traditional floral Jaal patterns with subtle golden Zari sheen.',
    category: "Women's Fashion",
    brand: 'Aarong',
    price: 6850,
    originalPrice: 8900,
    discount: 23,
    rating: 4.9,
    reviewCount: 145,
    soldCount: 650,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['saree', 'jamdani', 'womens-wear', 'ethnic', 'handloom'],
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Material: 'Blended Resham Silk with Golden Zari',
      Length: '12 Haat with unstitched matching blouse piece',
      Weave: 'Traditional Handloom Jamdani',
      Care: 'Dry Clean Only'
    },
    warranty: 'Authenticity Guaranteed',
    deliveryDays: 3
  },

  // 7. Shoes - Apex Formal Shoes
  {
    id: 'prod-7',
    title: 'Apex Venturini Genuine Leather Formal Oxford Shoes for Men',
    description: 'Sophisticated dress shoes handcrafted from full-grain supple calfskin leather with memory-cushion insole and durable slip-resistant TPR outsole for effortless executive comfort.',
    category: 'Shoes',
    brand: 'Apex',
    price: 4990,
    originalPrice: 6290,
    discount: 21,
    rating: 4.8,
    reviewCount: 420,
    soldCount: 2200,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['shoes', 'leather', 'formal', 'apex', 'oxford'],
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Upper: '100% Genuine Full-Grain Leather',
      Lining: 'Breathable Leather Insole',
      Sole: 'Non-slip Thermo Plastic Rubber (TPR)',
      Closure: 'Classic Lace-Up'
    },
    warranty: '6 Months Repair Warranty',
    deliveryDays: 2
  },

  // 8. Shoes - Running Sneakers
  {
    id: 'prod-8',
    title: 'Sprint Men Pro Runner Lightweight Breathable Athletic Sneakers',
    description: 'High performance sports shoes featuring dynamic air-mesh ventilation, shock-absorbing EVA midsole cushion, and grippy rubber traction pods for running and daily training.',
    category: 'Shoes',
    brand: 'Sprint',
    price: 2490,
    originalPrice: 3290,
    discount: 24,
    rating: 4.7,
    reviewCount: 310,
    soldCount: 1650,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['sneakers', 'running', 'shoes', 'sports', 'sprint'],
    isNewArrival: true,
    freeDelivery: true,
    specifications: {
      Upper: 'Engineered High-Breathability Mesh',
      Midsole: 'Responsive Energy Foam',
      Weight: '260g (Super Light)',
      Usage: 'Running, Gym, Walking'
    },
    warranty: '30 Days Quality Guarantee',
    deliveryDays: 2
  },

  // 9. Beauty - Face Serum
  {
    id: 'prod-9',
    title: 'The Ordinary Niacinamide 10% + Zinc 1% Blemish & Pore Refining Serum',
    description: 'High-strength vitamin and mineral blemish formula with 10% pure Niacinamide and 1% Zinc PCA to balance sebum activity, minimize pore size, and visibly brighten skin tone.',
    category: 'Beauty',
    brand: 'The Ordinary',
    price: 1350,
    originalPrice: 1750,
    discount: 23,
    rating: 4.8,
    reviewCount: 520,
    soldCount: 4200,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['beauty', 'skincare', 'serum', 'niacinamide', 'acne'],
    isBestSeller: true,
    isMall: true,
    freeDelivery: false,
    specifications: {
      Volume: '30ml',
      'Skin Type': 'Oily, Combination, Acne-prone',
      Formulation: 'Water-based Oil-free Serum',
      Authenticity: '100% Original Imported with QR Check'
    },
    warranty: 'Original Product Guaranteed',
    deliveryDays: 1
  },

  // 10. Home & Living - Non-Stick Cookware
  {
    id: 'prod-10',
    title: 'Kiam 7-Piece Premium Granite Die-Cast Non-Stick Cookware Set',
    description: 'Heavy gauge forged aluminum body with multi-layer scratch-resistant granite non-stick coating, induction-compatible magnetic base, and heat-resistant ergonomic soft-touch handles.',
    category: 'Home & Living',
    brand: 'Kiam',
    price: 4750,
    originalPrice: 6200,
    discount: 23,
    rating: 4.7,
    reviewCount: 198,
    soldCount: 1100,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['kitchen', 'cookware', 'home', 'kiam', 'pots'],
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Contents: '1 Casserole, 1 Kadai, 1 Frypan, 1 Milkpan, 3 Glass Lids',
      Coating: '5-Layer German Greblon Granite Non-stick',
      Stove: 'Gas, Induction, Ceramic, Electric Safe',
      PFOA: '100% Free from PFOA and Lead'
    },
    warranty: '1 Year Coating Warranty',
    deliveryDays: 3
  },

  // 11. Grocery - Basmati Rice
  {
    id: 'prod-11',
    title: 'Pran Premium Chinigura Fragrant Aromatic Rice (5 kg Bag)',
    description: 'Specially cultivated aromatic Chinigura rice with delicate fragrance and soft texture. Ideal for authentic Bangladeshi Biryani, Kacchi, Pulao, and sweet Payesh puddings.',
    category: 'Grocery',
    brand: 'Pran',
    price: 780,
    originalPrice: 890,
    discount: 12,
    rating: 4.8,
    reviewCount: 380,
    soldCount: 5400,
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['grocery', 'rice', 'chinigura', 'food', 'biryani'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      NetWeight: '5 Kilograms',
      Quality: 'Aged Old Crop Extra Grain',
      Packaging: 'Hygienic Moisture-proof Poly Pack',
      Origin: 'Dinajpur, Bangladesh'
    },
    deliveryDays: 1
  },

  // 12. Grocery - Pure Mustard Oil
  {
    id: 'prod-12',
    title: 'Radhuni Pure Kachi Ghani Mustard Oil (1 Litre Bottle)',
    description: 'Cold-pressed traditional mustard oil with pungent natural aroma and rich golden clarity. Authentic flavor enhancer for Bangladeshi Bhorta, pickles, and traditional dishes.',
    category: 'Grocery',
    brand: 'Radhuni',
    price: 360,
    originalPrice: 420,
    discount: 14,
    rating: 4.9,
    reviewCount: 290,
    soldCount: 4600,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['grocery', 'oil', 'mustard', 'radhuni', 'bhorta'],
    freeDelivery: false,
    specifications: {
      Volume: '1 Litre',
      Extraction: 'Cold Pressed Wood Ghani Extracted',
      Grade: 'Grade 1 Pure Agmark Certified'
    },
    deliveryDays: 1
  },

  // 13. Sports - Cricket Bat
  {
    id: 'prod-13',
    title: 'SS Master 5000 English Willow Full Size Cricket Bat',
    description: 'Hand-selected premium Grade 2 English willow blade with massive thick edges, mid-to-low sweet spot profile, and 12-piece cane handle with rubber ripple grip.',
    category: 'Sports',
    brand: 'SS Ton',
    price: 9400,
    originalPrice: 12500,
    discount: 25,
    rating: 4.7,
    reviewCount: 68,
    soldCount: 320,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['sports', 'cricket', 'bat', 'willow', 'game'],
    isNewArrival: true,
    freeDelivery: true,
    specifications: {
      Willow: 'Imported English Willow Grade 2',
      Weight: '1180 - 1220 grams',
      Handle: 'Short Handle Round Cane',
      Cover: 'Includes Padded Bat Cover'
    },
    warranty: 'Handle 6 Months Warranty',
    deliveryDays: 2
  },

  // 14. Accessories - Polarized Sunglasses
  {
    id: 'prod-14',
    title: 'Vincent Chase Polarized Aviator Sunglasses with UV400 Protection',
    description: 'Classic lightweight metallic aviator sunglasses engineered with polarized TAC lenses that eliminate blinding glare and provide 100% protection against harmful UVA and UVB rays.',
    category: 'Accessories',
    brand: 'Vincent Chase',
    price: 1490,
    originalPrice: 2490,
    discount: 40,
    rating: 4.6,
    reviewCount: 142,
    soldCount: 950,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['sunglasses', 'accessories', 'aviator', 'fashion', 'eyewear'],
    isFlashSale: true,
    freeDelivery: true,
    specifications: {
      Frame: 'Corrosion-Resistant Metal Alloy',
      Lens: 'Polarized Triacetate Cellulose (TAC)',
      Protection: 'UV400 Category 3',
      Accessories: 'Hard Leather Case & Microfiber Cloth'
    },
    warranty: '1 Year Frame Warranty',
    deliveryDays: 2
  },

  // 15. Electronics - 4K Smart TV
  {
    id: 'prod-15',
    title: 'Walton 43" 4K UHD Android Google Smart LED TV with Voice Remote',
    description: 'Immerse in breathtaking 4K Ultra HD visuals with HDR10+, Dolby Audio 20W box speakers, Google TV OS with licensed Netflix and YouTube, and built-in Chromecast.',
    category: 'Electronics',
    brand: 'Walton',
    price: 36900,
    originalPrice: 44000,
    discount: 16,
    rating: 4.8,
    reviewCount: 310,
    soldCount: 840,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['tv', 'electronics', 'smart-tv', 'walton', '4k'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Display: '43 Inch 4K UHD (3840x2160) DLED',
      OS: 'Google TV Android 11 with Play Store',
      Audio: '20W Dolby Digital Plus Stereo',
      Ports: '3 HDMI 2.1, 2 USB, Optical, Wi-Fi 5GHz'
    },
    warranty: '5 Years Panel & 2 Years Parts Warranty',
    deliveryDays: 3
  },

  // 16. Mobile Phones - Samsung
  {
    id: 'prod-16',
    title: 'Samsung Galaxy A15 5G (8GB / 128GB) - 50MP Triple Camera',
    description: 'Super AMOLED 90Hz display with Vision Booster, high-speed 5G connectivity, versatile 50MP triple camera system, and 5000mAh battery supporting 25W super fast charging.',
    category: 'Mobile Phones',
    brand: 'Samsung',
    price: 24500,
    originalPrice: 28999,
    discount: 15,
    rating: 4.7,
    reviewCount: 315,
    soldCount: 1820,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['samsung', 'mobile', 'galaxy', '5g', 'smartphone'],
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Display: '6.5" Super AMOLED 90Hz',
      Processor: 'MediaTek Dimensity 6100+',
      Camera: '50MP Main + 5MP Ultra-wide + 2MP Macro',
      Battery: '5000mAh with 25W Fast Charge'
    },
    warranty: '1 Year Samsung Bangladesh Official Warranty',
    deliveryDays: 2
  },

  // 17. Watches - Mechanical Watch
  {
    id: 'prod-17',
    title: 'Fossil Townsman Automatic Skeleton Black Stainless Steel Watch',
    description: 'An alluring masterpiece showing the intricate inner mechanical escapement movement through an openwork skeleton dial, encased in brushed gunmetal stainless steel.',
    category: 'Watches',
    brand: 'Fossil',
    price: 18500,
    originalPrice: 24000,
    discount: 23,
    rating: 4.9,
    reviewCount: 88,
    soldCount: 290,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['watch', 'fossil', 'automatic', 'luxury', 'watches'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Movement: 'Automatic Self-Winding Skeleton',
      CaseSize: '44mm Stainless Steel',
      WaterResistance: '5 ATM (50 meters)',
      Strap: 'Solid Stainless Steel Bracelet'
    },
    warranty: '2 Years International Warranty',
    deliveryDays: 2
  },

  // 18. Beauty - Matte Lipstick Set
  {
    id: 'prod-18',
    title: 'Maybelline SuperStay Matte Ink Liquid Lipstick Trio Pack',
    description: 'Flawless matte finish that stays on for up to 16 hours without fading or transfer. Highly pigmented formulation with precision arrow applicator for intense coverage.',
    category: 'Beauty',
    brand: 'Maybelline',
    price: 1890,
    originalPrice: 2700,
    discount: 30,
    rating: 4.8,
    reviewCount: 640,
    soldCount: 3800,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['beauty', 'lipstick', 'maybelline', 'makeup', 'cosmetics'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Shades: 'Lover (Pink), Pioneer (Red), Seductress (Nude)',
      Finish: 'Matte Liquid Ink',
      Duration: 'Up to 16 Hours Longwear Transfer-proof'
    },
    warranty: '100% Authentic Product',
    deliveryDays: 1
  },

  // 19. Computers - Mechanical Keyboard
  {
    id: 'prod-19',
    title: 'Redragon K552 Kumara RGB Mechanical Gaming Keyboard - Blue Switches',
    description: 'Compact 87-key tenkeyless layout featuring custom mechanical clicky switches, vibrant customizable RGB backlighting, aircraft-grade aluminum construction, and gold-plated USB.',
    category: 'Computers',
    brand: 'Redragon',
    price: 2850,
    originalPrice: 3600,
    discount: 21,
    rating: 4.7,
    reviewCount: 340,
    soldCount: 1900,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['keyboard', 'gaming', 'rgb', 'mechanical', 'computer'],
    isNewArrival: true,
    freeDelivery: true,
    specifications: {
      Switch: 'Outemu Dustproof Blue (Clicky & Tactile)',
      Layout: '87 Keys Tenkeyless (TKL)',
      Backlight: 'Full RGB with 18 lighting modes',
      AntiGhosting: 'All 87 keys N-Key Rollover'
    },
    warranty: '1 Year Warranty',
    deliveryDays: 2
  },

  // 20. Accessories - Genuine Leather Wallet
  {
    id: 'prod-20',
    title: 'Wildhorn Genuine Hunter Leather RFID Protected Bifold Wallet for Men',
    description: 'Crafted from authentic distressed full-grain hunter cowhide leather that develops a handsome vintage patina over time. Equipped with certified RFID shielding technology.',
    category: 'Accessories',
    brand: 'Wildhorn',
    price: 1190,
    originalPrice: 1950,
    discount: 39,
    rating: 4.8,
    reviewCount: 280,
    soldCount: 2300,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['wallet', 'leather', 'accessories', 'mens-wallet', 'rfid'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Material: '100% Genuine Distressed Hunter Leather',
      Slots: '8 Card Slots, 2 Currency Compartments, 1 Coin Pocket',
      Security: 'Certified RFID Blocking Lining'
    },
    warranty: '6 Months Stitching Warranty',
    deliveryDays: 2
  },

  // 21. Home & Living - Ergonomic Desk Chair
  {
    id: 'prod-21',
    title: 'Sihoo M18 High-Back Ergonomic Office & Gaming Mesh Chair',
    description: 'Scientifically contoured lumbar support, multi-dimensional adjustable armrests, breathable high-tensile mesh back, 126-degree tilt recline mechanism, and heavy-duty steel base.',
    category: 'Home & Living',
    brand: 'Sihoo',
    price: 16500,
    originalPrice: 21000,
    discount: 21,
    rating: 4.8,
    reviewCount: 112,
    soldCount: 430,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589384267710-7a25bc20c571?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['chair', 'furniture', 'office', 'ergonomic', 'home'],
    freeDelivery: true,
    specifications: {
      Backrest: 'Ergonomic S-shape Breathable Mesh',
      Cylinder: 'SGS Class 3 Heavy Duty Gas Lift',
      WeightCapacity: 'Up to 150 kg',
      Castors: 'Silent 360-degree PU Swivel Wheels'
    },
    warranty: '3 Years Mechanical Warranty',
    deliveryDays: 4
  },

  // 22. Sports - Yoga Mat
  {
    id: 'prod-22',
    title: 'Strauss 6mm Eco-Friendly TPE Non-Slip Exercise & Yoga Mat with Carry Strap',
    description: 'Double-layer textured non-slip surface provides superior grip on wooden, tile, or cement floors. High-density 6mm thickness protects spine, hips, knees, and elbows during workouts.',
    category: 'Sports',
    brand: 'Strauss',
    price: 1250,
    originalPrice: 1800,
    discount: 31,
    rating: 4.7,
    reviewCount: 175,
    soldCount: 1150,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['yoga', 'fitness', 'exercise', 'sports', 'mat'],
    freeDelivery: false,
    specifications: {
      Thickness: '6mm High-Density Cushioning',
      Material: '100% Recyclable Biodegradable TPE',
      Dimensions: '183cm x 61cm',
      Features: 'Waterproof, sweat-resistant, easy to wipe'
    },
    warranty: '30 Days Quality Guarantee',
    deliveryDays: 2
  },

  // 23. Mobile Phones - Power Bank
  {
    id: 'prod-23',
    title: 'Xiaomi 20,000mAh 22.5W Two-Way Fast Charge Power Bank 3 (Dual USB-A + Type-C)',
    description: 'Massive 20,000mAh capacity capable of charging typical smartphones 4-5 times over. Supports multiple fast charging protocols including PD 3.0, QC 3.0, and low-current mode for earbuds.',
    category: 'Mobile Phones',
    brand: 'Xiaomi',
    price: 2450,
    originalPrice: 3200,
    discount: 23,
    rating: 4.9,
    reviewCount: 890,
    soldCount: 5600,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['powerbank', 'xiaomi', 'charger', 'fast-charge', 'battery'],
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Capacity: '20,000mAh 74Wh 3.7V',
      Output: 'Type-C 22.5W Max, 2x USB-A 22.5W Max',
      Protection: '9-Layer Circuit Chip Protection',
      Weight: '434g'
    },
    warranty: '6 Months Replacement Warranty',
    deliveryDays: 1
  },

  // 24. Women's Fashion - Kurti Set
  {
    id: 'prod-24',
    title: 'Aarong Hand-Printed Rayon Cotton 3-Piece Salwar Kameez Suit Set',
    description: 'Graceful everyday ethnic suit crafted from breathable rayon-cotton fabric featuring artistic block prints, stitched palazzo pants, and lightweight chiffon dupatta with border lace.',
    category: "Women's Fashion",
    brand: 'Aarong',
    price: 3450,
    originalPrice: 4500,
    discount: 23,
    rating: 4.8,
    reviewCount: 220,
    soldCount: 1400,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['salwar', 'kameez', 'womens-wear', 'fashion', 'ethnic'],
    isNewArrival: true,
    freeDelivery: true,
    specifications: {
      Fabric: 'Premium Combed Rayon Cotton Blend',
      SetIncludes: 'Kameez, Stitched Palazzo, Chiffon Dupatta',
      Sizes: 'S (36), M (38), L (40), XL (42), XXL (44)',
      Washing: 'Gentle Hand Wash'
    },
    warranty: '7 Days Return',
    deliveryDays: 2
  },

  // 25. Electronics - Soundbar
  {
    id: 'prod-25',
    title: 'JBL Bar 2.1 Deep Bass Soundbar with 6.5" Wireless Subwoofer (300W Output)',
    description: 'Transform your living room into a private theater with 300 watts of legendary JBL sound, Dolby Digital audio processing, deep wireless subwoofer bass, and HDMI ARC connectivity.',
    category: 'Electronics',
    brand: 'JBL',
    price: 28500,
    originalPrice: 34999,
    discount: 19,
    rating: 4.9,
    reviewCount: 160,
    soldCount: 520,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['soundbar', 'jbl', 'audio', 'speaker', 'home-theater'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Power: '300W Max Total Audio Output',
      Subwoofer: '6.5" Down-firing Wireless Sub',
      Inputs: 'HDMI In/Out (with ARC), Optical, Bluetooth 4.2',
      AudioTech: 'Dolby Digital Embedded'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 3
  },

  // 26. Men's Fashion - Polo Shirt
  {
    id: 'prod-26',
    title: 'Apex Classic Pique Cotton Slim Fit Solid Polo Shirt - Forest Green',
    description: 'Made from double-mercerized 100% cotton pique with ribbed flat-knit collar, two-button mother-of-pearl placket, and side vents for refined casual elegance.',
    category: "Men's Fashion",
    brand: 'Apex',
    price: 1150,
    originalPrice: 1590,
    discount: 28,
    rating: 4.7,
    reviewCount: 380,
    soldCount: 2600,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['polo', 'tshirt', 'mens-wear', 'fashion', 'casual'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Fabric: '220 GSM 100% Combed Cotton Pique',
      Fit: 'Slim European Fit',
      Wash: 'Pre-shrunk anti-pilling fabric'
    },
    warranty: '7 Days Replacement',
    deliveryDays: 2
  },

  // 27. Computers - Wireless Gaming Mouse
  {
    id: 'prod-27',
    title: 'Logitech G304 Lightspeed Wireless Ultra-Fast Gaming Mouse (12,000 DPI Hero Sensor)',
    description: 'Featuring the next-gen HERO gaming sensor with 12,000 DPI sensitivity and 400 IPS accuracy. Delivers 1ms ultra-fast Lightspeed wireless report rate and 250 hours on a single AA battery.',
    category: 'Computers',
    brand: 'Logitech',
    price: 3650,
    originalPrice: 4500,
    discount: 19,
    rating: 4.9,
    reviewCount: 420,
    soldCount: 2100,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['mouse', 'logitech', 'gaming', 'wireless', 'computer'],
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Sensor: 'HERO Optical Sensor (200 - 12,000 DPI)',
      Wireless: 'LIGHTSPEED 1ms Report Rate',
      Battery: 'Up to 250 hours endurance mode',
      Weight: '99 grams'
    },
    warranty: '2 Years Replacement Warranty',
    deliveryDays: 2
  },

  // 28. Beauty - Aloe Vera Soothing Gel
  {
    id: 'prod-28',
    title: 'Nature Republic California Aloe Vera 92% Soothing Gel (300ml Jumbo Tub)',
    description: 'Iconic Korean soothing gel enriched with 92% certified organic California aloe vera. Provides intense cooling hydration for face, body, sunburns, irritated skin, and hair conditioning.',
    category: 'Beauty',
    brand: 'Nature Republic',
    price: 650,
    originalPrice: 950,
    discount: 32,
    rating: 4.8,
    reviewCount: 710,
    soldCount: 6200,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['beauty', 'aloe-vera', 'skincare', 'gel', 'korean'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Volume: '300ml Extra Large Tub',
      Organic: 'CCOF Certified Organic Aloe Vera',
      Use: 'Moisturizer, After-sun, Hair mask, Shaving gel'
    },
    deliveryDays: 1
  },

  // 29. Home & Living - Electric Kettle
  {
    id: 'prod-29',
    title: 'Miyako 1.8 Litre Stainless Steel Cordless Fast-Boil Electric Kettle',
    description: 'Rapid 1500W rapid boiling element boils water in under 4 minutes. Built with food-grade 304 stainless steel interior, 360-degree swivel base, and automatic boil-dry shutoff safety.',
    category: 'Home & Living',
    brand: 'Miyako',
    price: 1150,
    originalPrice: 1600,
    discount: 28,
    rating: 4.6,
    reviewCount: 390,
    soldCount: 2900,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['kettle', 'kitchen', 'home', 'miyako', 'appliance'],
    freeDelivery: false,
    specifications: {
      Capacity: '1.8 Litres',
      Power: '1500 Watts 220V',
      Safety: 'Auto Cut-off & Boil Dry Protection',
      Body: 'Food Grade 304 Stainless Steel'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 2
  },

  // 30. Grocery - Pure Honey
  {
    id: 'prod-30',
    title: 'Sundarbans Wild Raw Organic Khalisa Flower Honey (500g Glass Jar)',
    description: '100% natural, unfiltered, unpasteurized wild forest honey harvested directly by traditional honey-hunters (Mawalis) in the mangrove forests of the Sundarbans.',
    category: 'Grocery',
    brand: 'Sundarbans Organic',
    price: 690,
    originalPrice: 850,
    discount: 19,
    rating: 4.9,
    reviewCount: 210,
    soldCount: 1800,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['honey', 'organic', 'grocery', 'sundarbans', 'natural'],
    freeDelivery: false,
    specifications: {
      Origin: 'Sundarbans Mangrove Reserve, Bangladesh',
      Weight: '500 grams in Food-Grade Glass Jar',
      Purity: 'No Added Sugar, Artificial Flavors or Preservatives'
    },
    deliveryDays: 1
  },

  // 31. Shoes - Women's Flat Sandals
  {
    id: 'prod-31',
    title: 'Apex Moochie Comfort Strap Casual Leather Slip-On Sandals for Women',
    description: 'Designed for effortless everyday wear, featuring soft vegan leather criss-cross upper straps, ergonomic arch-contoured footbed, and durable anti-skid rubber sole.',
    category: 'Shoes',
    brand: 'Apex Moochie',
    price: 1890,
    originalPrice: 2490,
    discount: 24,
    rating: 4.8,
    reviewCount: 160,
    soldCount: 980,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['sandals', 'womens-shoes', 'apex', 'footwear', 'casual'],
    freeDelivery: true,
    specifications: {
      Upper: 'Supple PU Leather',
      Insole: 'Cushioned Memory Foam Bed',
      Closure: 'Slip-On Open Toe'
    },
    warranty: '3 Months Warranty',
    deliveryDays: 2
  },

  // 32. Accessories - Travel Backpack
  {
    id: 'prod-32',
    title: 'Arctic Hunter Waterproof Anti-Theft Laptop Travel Backpack with USB Port',
    description: 'High-density water-repellent oxford fabric with hidden anti-theft back pocket, dedicated 15.6" shockproof laptop sleeve, built-in USB external charging port, and luggage strap.',
    category: 'Accessories',
    brand: 'Arctic Hunter',
    price: 3200,
    originalPrice: 4500,
    discount: 29,
    rating: 4.8,
    reviewCount: 290,
    soldCount: 1750,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['backpack', 'bag', 'laptop-bag', 'travel', 'accessories'],
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Capacity: '25 Litres Expanded Volume',
      Material: 'Waterproof Scratch-Proof Ballistic Oxford',
      LaptopFit: 'Fits up to 15.6" Laptops + 11" iPad',
      Zippers: 'YKK Explosion-Proof Metal Zippers'
    },
    warranty: '1 Year Warranty',
    deliveryDays: 2
  },

  // 33. Sports - Football
  {
    id: 'prod-33',
    title: 'Cosco FIFA Approved Match Grade Hand-Stitched Size 5 Football',
    description: 'Official tournament match football crafted from textured polyurethane micro-fiber leather, 32-panel hand-stitched construction with high-air retention latex bladder.',
    category: 'Sports',
    brand: 'Cosco',
    price: 1850,
    originalPrice: 2400,
    discount: 23,
    rating: 4.7,
    reviewCount: 130,
    soldCount: 890,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['football', 'soccer', 'sports', 'match-ball', 'game'],
    freeDelivery: false,
    specifications: {
      Size: 'Standard Official Size 5 (Circumference 68-70cm)',
      Material: 'Synthetic PU Leather Outer Layer',
      Panels: '32 Hand-Stitched Panels',
      Bladder: 'Zero-Wing Butyl Bladder'
    },
    warranty: '6 Months Stitching Guarantee',
    deliveryDays: 2
  },

  // 34. Watches - Casio Vintage
  {
    id: 'prod-34',
    title: 'Casio Vintage Illuminator Digital Gold Stainless Steel Watch (A168WG-9)',
    description: 'Iconic retro design that never goes out of fashion. Features electro-luminescent backlight, 1/100-second digital stopwatch, daily alarm, hourly time signal, and water resistance.',
    category: 'Watches',
    brand: 'Casio',
    price: 4950,
    originalPrice: 6200,
    discount: 20,
    rating: 4.9,
    reviewCount: 510,
    soldCount: 2800,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['casio', 'vintage', 'digital-watch', 'watches', 'gold'],
    isBestSeller: true,
    isMall: true,
    freeDelivery: true,
    specifications: {
      Band: 'Adjustable Gold Ion-Plated Stainless Steel Band',
      Battery: 'Approx 7 years on CR2016',
      WaterResistance: 'Daily Water Resistant (Splashes & Rain)',
      Features: 'EL Backlight, 1/100s Stopwatch, Auto Calendar'
    },
    warranty: '2 Years Official Casio Warranty',
    deliveryDays: 1
  },

  // 35. Electronics - Noise Cancelling Headphones
  {
    id: 'prod-35',
    title: 'Sony WH-CH720N Wireless Active Noise Canceling Over-Ear Headphones',
    description: 'Powered by Sony V1 processor for natural sound and immersive noise cancelation. Enjoy up to 35 hours battery life with quick charge, multipoint Bluetooth pairing, and beamforming microphones.',
    category: 'Electronics',
    brand: 'Sony',
    price: 13900,
    originalPrice: 17500,
    discount: 21,
    rating: 4.8,
    reviewCount: 210,
    soldCount: 740,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['headphones', 'sony', 'anc', 'wireless', 'audio'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      NoiseCancelling: 'Dual Noise Sensor with V1 Processor',
      BatteryLife: 'Up to 35 hours (ANC ON), 50 hours (ANC OFF)',
      Weight: '192g (Ultra Lightweight)',
      Bluetooth: 'Version 5.2 with Multipoint'
    },
    warranty: '1 Year Warranty',
    deliveryDays: 2
  },

  // 36. Computers - External SSD
  {
    id: 'prod-36',
    title: 'Samsung T7 Shield 1TB Rugged Portable External SSD (Up to 1050 MB/s)',
    description: 'Tough, durable, and compact high-speed storage engineered with IP65 water and dust resistance and drop-tested up to 3 meters. Blazing read speeds up to 1050 MB/s via USB 3.2 Gen 2.',
    category: 'Computers',
    brand: 'Samsung',
    price: 12400,
    originalPrice: 15500,
    discount: 20,
    rating: 4.9,
    reviewCount: 140,
    soldCount: 620,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['ssd', 'storage', 'samsung', 'portable', 'computer'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Interface: 'USB 3.2 Gen 2 (10Gbps)',
      Speed: 'Sequential Read up to 1050 MB/s, Write 1000 MB/s',
      Durability: 'IP65 Dust & Water Resistant, 3-meter Drop Resistant',
      Compatibility: 'Windows, Mac, Android, iPad, Gaming Consoles'
    },
    warranty: '3 Years Warranty',
    deliveryDays: 2
  },

  // 37. Men's Fashion - Jeans
  {
    id: 'prod-37',
    title: "Apex Men's Stretch Denim Regular Fit Indigo Blue Jeans",
    description: 'Classic 5-pocket blue jeans tailored with comfortable stretch cotton denim, heavy-duty brass rivets, durable zip fly, and rich authentic enzyme stone wash.',
    category: "Men's Fashion",
    brand: 'Apex',
    price: 1790,
    originalPrice: 2490,
    discount: 28,
    rating: 4.7,
    reviewCount: 310,
    soldCount: 1900,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['jeans', 'denim', 'mens-fashion', 'pants', 'pants-blue'],
    freeDelivery: false,
    specifications: {
      Material: '98% Cotton, 2% Spandex Stretch Denim',
      Fit: 'Straight Regular Fit',
      Wash: 'Medium Indigo Enzyme Stone Wash'
    },
    warranty: '7 Days Exchange',
    deliveryDays: 2
  },

  // 38. Home & Living - Bedding Set
  {
    id: 'prod-38',
    title: 'Aarong 100% Combed Cotton King Size Bed Sheet Set with 2 Pillow Covers',
    description: 'Crafted from 300 thread count long-staple combed cotton with soothing floral motif prints that remain silky soft and vibrant through hundreds of washes.',
    category: 'Home & Living',
    brand: 'Aarong',
    price: 2650,
    originalPrice: 3400,
    discount: 22,
    rating: 4.8,
    reviewCount: 195,
    soldCount: 1250,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['bedsheet', 'cotton', 'home', 'bedding', 'aarong'],
    freeDelivery: true,
    specifications: {
      Dimensions: 'King Size (7.5 ft x 8.5 ft / 228cm x 259cm)',
      PillowCovers: '2 Matching Pillow Covers (20" x 30")',
      ThreadCount: '300 TC Long-Staple Pure Cotton'
    },
    warranty: 'Color Guarantee',
    deliveryDays: 2
  },

  // 39. Grocery - Premium Tea
  {
    id: 'prod-39',
    title: 'Ispahani Mirzapore Best Leaf Black Tea (400g Foil Pack)',
    description: 'Blended from the finest tender tea leaves grown in the pristine gardens of Sylhet and Chittagong hills. Known for rich liquor, lively briskness, and invigorating fresh aroma.',
    category: 'Grocery',
    brand: 'Ispahani',
    price: 240,
    originalPrice: 280,
    discount: 14,
    rating: 4.9,
    reviewCount: 420,
    soldCount: 7800,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['tea', 'grocery', 'ispahani', 'cha', 'beverage'],
    freeDelivery: false,
    specifications: {
      Weight: '400 grams',
      Type: 'Granular CTC Black Tea Leaf',
      Origin: 'Sylhet Gardens, Bangladesh'
    },
    deliveryDays: 1
  },

  // 40. Electronics - Smart LED Bulb
  {
    id: 'prod-40',
    title: 'Xiaomi Mi Smart LED Bulb Essential (White & Color RGB 9W E27)',
    description: '16 million colors and adjustable color temperature from warm 1700K to cool 6500K. Works directly via Wi-Fi with Google Assistant and Amazon Alexa without needing an external bridge.',
    category: 'Electronics',
    brand: 'Xiaomi',
    price: 1450,
    originalPrice: 1990,
    discount: 27,
    rating: 4.7,
    reviewCount: 310,
    soldCount: 2100,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1550985543-f47f38aeee65?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['smart-bulb', 'lighting', 'xiaomi', 'rgb', 'smarthome'],
    freeDelivery: false,
    specifications: {
      LuminousFlux: '950 Lumens at 9W',
      Socket: 'Standard E27 Screw Base',
      Connectivity: 'Wi-Fi IEEE 802.11 b/g/n 2.4GHz',
      Lifespan: 'Approx 25,000 Hours'
    },
    warranty: '1 Year Replacement Warranty',
    deliveryDays: 2
  }
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Mega Flash Savings Festival',
    subtitle: 'Up to 60% OFF on Genuine Tech & Flagship Smartphones',
    badge: 'Limited Time Deal',
    discount: 'Up to 60% OFF',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Shop Flash Deals',
    link: '/products?filter=flash',
    bgGradient: 'from-orange-600 via-amber-600 to-rose-600',
    status: 'active'
  },
  {
    id: 'ban-2',
    title: 'Authentic Festive Fashion & Handloom',
    subtitle: 'Dhakai Jamdani, Combed Cotton Panjabis & Artisan Wear',
    badge: 'New Season Launch',
    discount: 'Flat 30% OFF',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Explore Collection',
    link: '/category/womens-fashion',
    bgGradient: 'from-emerald-700 via-teal-700 to-cyan-800',
    status: 'active'
  },
  {
    id: 'ban-3',
    title: 'ShopNexa Official Brand Mall',
    subtitle: '100% Authentic Products with Brand Warranty & 7-Day Free Returns',
    badge: '100% Genuine Guaranteed',
    discount: 'Free Delivery',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Visit Official Mall',
    link: '/products?filter=mall',
    bgGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    status: 'active'
  },
  {
    id: 'ban-4',
    title: 'Pacesetter Footwear & Active Living',
    subtitle: 'Apex Leather Oxfords, Sprint Runners, and Athletic Gear',
    badge: 'Trending Now',
    discount: 'Starting ৳1,190',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Shop Footwear',
    link: '/category/shoes',
    bgGradient: 'from-blue-700 via-indigo-700 to-purple-800',
    status: 'active'
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 1000,
    maxDiscount: 500,
    description: '10% off for all new ShopNexa shoppers on orders over ৳1,000',
    expiresAt: '2026-12-31',
    active: true
  },
  {
    code: 'SAVE200',
    discountType: 'fixed',
    value: 200,
    minOrderAmount: 1500,
    description: 'Flat ৳200 discount on orders exceeding ৳1,500',
    expiresAt: '2026-11-30',
    active: true
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    value: 60,
    minOrderAmount: 800,
    description: 'Free standard delivery across Bangladesh on orders over ৳800',
    expiresAt: '2026-10-31',
    active: true
  },
  {
    code: 'NEXA500',
    discountType: 'fixed',
    value: 500,
    minOrderAmount: 3500,
    description: 'Mega ৳500 instant discount on electronics and cart over ৳3,500',
    expiresAt: '2026-12-31',
    active: true
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Tanvir Hossain',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '3 days ago',
    comment: 'Alhamdulillah received 100% authentic phone in intact packaging within 2 days in Mirpur! Camera quality is mind-blowing, 200MP photos are super sharp. Thanks ShopNexa!',
    verifiedPurchase: true,
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Farzana Akter',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '1 week ago',
    comment: 'Great smartphone at this price point. Battery easily lasts 1.5 days with normal usage. The 67W charger in the box is super fast!',
    verifiedPurchase: true,
    helpfulCount: 16
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Mahmudul Hasan',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '5 days ago',
    comment: 'Sound quality and bass is punchy! Using it daily during gym workouts. Connection with my phone never drops.',
    verifiedPurchase: true,
    helpfulCount: 19
  },
  {
    id: 'rev-4',
    productId: 'prod-5',
    userName: 'Zubair Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Cotton fabric is pure combed quality and very comfortable for hot Dhaka weather. Embroidery work on the collar looks very premium.',
    verifiedPurchase: true,
    helpfulCount: 31
  },
  {
    id: 'rev-5',
    productId: 'prod-7',
    userName: 'Saiful Islam',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '4 days ago',
    comment: 'Authentic Apex shoes. Fitting is 100% accurate, memory foam insole makes standing in office super comfortable.',
    verifiedPurchase: true,
    helpfulCount: 12
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Rafiqul Islam',
    email: 'rafiqul@example.com',
    phone: '01711223344',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    role: 'customer',
    joinedDate: 'March 2023',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Rafiqul Islam',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'Dhaka City',
        area: 'Dhanmondi 27',
        fullAddress: 'House 42, Road 27, Dhanmondi R/A',
        postalCode: '1209',
        isDefault: true,
        label: 'Home'
      },
      {
        id: 'addr-2',
        fullName: 'Rafiqul Islam (Office)',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'Dhaka City',
        area: 'Motijheel C/A',
        fullAddress: 'Level 8, City Tower, Dilkusha C/A',
        postalCode: '1000',
        isDefault: false,
        label: 'Office'
      }
    ]
  },
  {
    id: 'usr-seller-1',
    name: 'Apex Merchant Admin',
    email: 'merchant@apexfootwear.com',
    phone: '01811998877',
    avatar: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80',
    role: 'seller',
    sellerId: 'seller-1',
    joinedDate: 'Jan 2021',
    addresses: []
  },
  {
    id: 'usr-admin-1',
    name: 'ShopNexa Master Admin',
    email: 'admin@shopnexa.com',
    phone: '01911002233',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    role: 'admin',
    joinedDate: 'Jan 2020',
    addresses: []
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'SNX-849201',
    userId: 'usr-customer-1',
    customerName: 'Rafiqul Islam',
    customerPhone: '01711223344',
    customerEmail: 'rafiqul@example.com',
    items: [
      {
        productId: 'prod-1',
        title: 'Redmi Note 13 Pro 4G (8GB RAM / 256GB ROM)',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
        price: 26999,
        quantity: 1,
        sellerName: 'Xiaomi Authorized BD'
      },
      {
        productId: 'prod-2',
        title: 'Anker Soundcore Life P2i True Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
        price: 2299,
        quantity: 1,
        sellerName: 'Walton Tech Hub'
      }
    ],
    subtotal: 29298,
    discount: 500,
    shippingFee: 0,
    total: 28798,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Rafiqul Islam',
      phone: '01711223344',
      division: 'Dhaka',
      district: 'Dhaka City',
      area: 'Dhanmondi 27',
      fullAddress: 'House 42, Road 27, Dhanmondi R/A',
      postalCode: '1209',
      isDefault: true,
      label: 'Home'
    },
    shippingMethod: 'Express Delivery',
    paymentMethod: 'Mobile Payment (bKash/Nagad)',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    timeline: [
      { status: 'Pending', timestamp: 'Yesterday 10:15 AM', description: 'Order placed by customer', completed: true },
      { status: 'Confirmed', timestamp: 'Yesterday 11:30 AM', description: 'Payment verified and confirmed', completed: true },
      { status: 'Processing', timestamp: 'Yesterday 02:45 PM', description: 'Packed at Dhaka Central Hub', completed: true },
      { status: 'Shipped', timestamp: 'Today 08:30 AM', description: 'Handed over to delivery rider', completed: true },
      { status: 'Out for Delivery', timestamp: 'Today 11:15 AM', description: 'Rider is on the way to your address', completed: true },
      { status: 'Delivered', timestamp: 'Estimated Today 05:00 PM', description: 'Package handed over to recipient', completed: false }
    ],
    createdAt: '2026-09-05T10:15:00Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'SNX-721590',
    userId: 'usr-customer-1',
    customerName: 'Rafiqul Islam',
    customerPhone: '01711223344',
    customerEmail: 'rafiqul@example.com',
    items: [
      {
        productId: 'prod-7',
        title: 'Apex Venturini Genuine Leather Formal Oxford Shoes',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
        price: 4990,
        quantity: 1,
        sellerName: 'Apex Footwear Official'
      }
    ],
    subtotal: 4990,
    discount: 200,
    shippingFee: 60,
    total: 4850,
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Rafiqul Islam',
      phone: '01711223344',
      division: 'Dhaka',
      district: 'Dhaka City',
      area: 'Dhanmondi 27',
      fullAddress: 'House 42, Road 27, Dhanmondi R/A',
      postalCode: '1209',
      isDefault: true,
      label: 'Home'
    },
    shippingMethod: 'Standard Delivery',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Delivered',
    timeline: [
      { status: 'Pending', timestamp: 'Aug 28 02:10 PM', description: 'Order placed by customer', completed: true },
      { status: 'Confirmed', timestamp: 'Aug 28 03:00 PM', description: 'Order confirmed by seller', completed: true },
      { status: 'Processing', timestamp: 'Aug 28 05:20 PM', description: 'Packed by Apex Merchant', completed: true },
      { status: 'Shipped', timestamp: 'Aug 29 09:00 AM', description: 'In transit to Dhaka Hub', completed: true },
      { status: 'Out for Delivery', timestamp: 'Aug 30 10:45 AM', description: 'Rider dispatched', completed: true },
      { status: 'Delivered', timestamp: 'Aug 30 01:25 PM', description: 'Delivered and cash collected', completed: true }
    ],
    createdAt: '2026-08-28T14:10:00Z'
  }
];

export const BD_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Rajshahi',
  'Khulna',
  'Sylhet',
  'Barishal',
  'Rangpur',
  'Mymensingh'
];

export const BD_DISTRICTS: Record<string, string[]> = {
  Dhaka: ['Dhaka City', 'Gazipur', 'Narayanganj', 'Tangail', 'Faridpur', 'Narsingdi', 'Manikganj', 'Munshiganj'],
  Chittagong: ['Chittagong City', "Cox's Bazar", 'Cumilla', 'Feni', 'Brahmanbaria', 'Noakhali', 'Chandpur'],
  Rajshahi: ['Rajshahi City', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore', 'Chapainawabganj'],
  Khulna: ['Khulna City', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah'],
  Sylhet: ['Sylhet City', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Barishal: ['Barishal City', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],
  Rangpur: ['Rangpur City', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Thakurgaon'],
  Mymensingh: ['Mymensingh City', 'Jamalpur', 'Netrokona', 'Sherpur']
};
