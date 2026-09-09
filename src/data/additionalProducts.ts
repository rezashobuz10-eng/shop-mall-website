import { Product } from '../types';

export const ADDITIONAL_PRODUCTS: Product[] = [
  // 47. Electronics - Samsung 55" 4K Smart TV
  {
    id: 'prod-47',
    title: 'Samsung 55" Crystal 4K UHD Smart LED TV (Crystal Processor 4K & HDR10+)',
    description: 'Immerse in lifelike billion shades of color with Dynamic Crystal Color and Crystal Processor 4K upscaling. Features Q-Symphony sound sync, SolarCell remote control, and Tizen OS with Netflix, YouTube, and Apple TV.',
    category: 'Electronics',
    brand: 'Samsung',
    price: 68500,
    originalPrice: 82000,
    discount: 16,
    rating: 4.9,
    reviewCount: 312,
    soldCount: 840,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['samsung', 'tv', '4k', 'smart-tv', 'electronics', 'crystal-uhd'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Display: '55" Ultra HD (3840 x 2160) 60Hz',
      Processor: 'Crystal Processor 4K with Contrast Enhancer',
      Audio: '20W 2CH Object Tracking Sound Lite (OTS Lite)',
      Connectivity: '3x HDMI, 1x USB, Wi-Fi 5, Bluetooth 5.2'
    },
    warranty: '2 Years Official Panel Warranty',
    deliveryDays: 2
  },

  // 48. Computers - Apple iPad 10th Gen
  {
    id: 'prod-48',
    title: 'Apple iPad 10th Generation 10.9-inch (A14 Bionic, 64GB Wi-Fi, Blue)',
    description: 'Striking all-screen design with a 10.9-inch Liquid Retina display. Powered by the high-efficiency A14 Bionic chip, landscape 12MP Ultra Wide front camera with Center Stage, and USB-C connectivity.',
    category: 'Computers',
    brand: 'Apple',
    price: 52900,
    originalPrice: 59000,
    discount: 10,
    rating: 4.9,
    reviewCount: 420,
    soldCount: 1250,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Blue', 'Silver', 'Pink', 'Yellow'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['apple', 'ipad', 'tablet', 'ios', 'a14-bionic'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Display: '10.9" Liquid Retina True Tone (2360 x 1640)',
      Chip: 'A14 Bionic chip with 6-core CPU and 4-core GPU',
      Camera: '12MP Wide back, 12MP Ultra Wide landscape front',
      Security: 'Touch ID integrated into top power button'
    },
    warranty: '1 Year Apple International Warranty',
    deliveryDays: 1
  },

  // 49. Mobile Phones - Samsung Galaxy S24 Ultra
  {
    id: 'prod-49',
    title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM / 256GB ROM, Titanium Gray, Galaxy AI)',
    description: 'Titanium exterior with integrated S-Pen. Powered by Snapdragon 8 Gen 3 for Galaxy, Quad Telephoto zoom system with 200MP main sensor, Circle to Search with Google, and real-time live call translation.',
    category: 'Mobile Phones',
    brand: 'Samsung',
    price: 169999,
    originalPrice: 185000,
    discount: 8,
    rating: 5.0,
    reviewCount: 680,
    soldCount: 940,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['samsung', 'galaxy', 's24-ultra', 'smartphone', 'flagship', 'ai'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Display: '6.8" Dynamic AMOLED 2X 120Hz Gorilla Armor (2600 nits)',
      Processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      Camera: '200MP + 50MP 5x + 10MP 3x + 12MP UltraWide',
      Battery: '5000mAh with 45W Fast Charging and 15W Wireless'
    },
    warranty: '1 Year Official Samsung Warranty',
    deliveryDays: 1
  },

  // 50. Mobile Phones - iPhone 16 Pro Max
  {
    id: 'prod-50',
    title: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium, Camera Control & A18 Pro)',
    description: 'Grade 5 titanium design with micro-blasted finish and larger 6.9-inch Super Retina XDR display. Features innovative dedicated Camera Control tactile button, 48MP Fusion camera with 5x Telephoto zoom.',
    category: 'Mobile Phones',
    brand: 'Apple',
    price: 198000,
    originalPrice: 215000,
    discount: 8,
    rating: 5.0,
    reviewCount: 540,
    soldCount: 820,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Desert Titanium', 'Natural Titanium', 'Black Titanium', 'White Titanium'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['apple', 'iphone', 'iphone16', 'flagship', 'promax'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Display: '6.9" Super Retina XDR OLED ProMotion 120Hz',
      Chip: 'A18 Pro chip with 6-core GPU & Apple Intelligence',
      Camera: '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      Battery: 'Up to 33 hours video playback with MagSafe 25W'
    },
    warranty: '1 Year Apple Official Warranty',
    deliveryDays: 1
  },

  // 51. Mobile Phones - Realme 12 Pro+ 5G
  {
    id: 'prod-51',
    title: 'Realme 12 Pro+ 5G (Submarine Blue, 8GB RAM / 256GB ROM, Periscope Portrait)',
    description: 'Luxury watch-inspired vegan leather design by Ollivier Saveo. Flagship 64MP Omnivision OV64B periscope portrait camera with 3x optical zoom and 120x SuperZoom, 120Hz curved vision display.',
    category: 'Mobile Phones',
    brand: 'Realme',
    price: 43999,
    originalPrice: 48999,
    discount: 10,
    rating: 4.8,
    reviewCount: 390,
    soldCount: 1650,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Submarine Blue', 'Navigator Beige'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['realme', 'smartphone', 'periscope', '5g', 'curved-display'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Processor: 'Qualcomm Snapdragon 7s Gen 2 (4nm)',
      Display: '6.7" FHD+ Curved OLED 120Hz 2160Hz PWM Dimming',
      Camera: '64MP Periscope + 50MP Sony IMX890 OIS + 8MP UltraWide',
      Charging: '67W SUPERVOOC Charge with 5000mAh Battery'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 2
  },

  // 52. Mobile Phones - Walton Primo S9 5G
  {
    id: 'prod-52',
    title: 'Walton Primo S9 5G Smartphone (8GB LPDDR4x / 128GB UFS, Diamond Black)',
    description: 'Proudly made in Bangladesh. Features MediaTek Dimensity 5G chipset, 6.78" FHD+ 120Hz punch-hole display, 50MP AI triple camera with night mode, and 5000mAh battery with 33W fast charging.',
    category: 'Mobile Phones',
    brand: 'Walton',
    price: 19999,
    originalPrice: 23500,
    discount: 15,
    rating: 4.6,
    reviewCount: 285,
    soldCount: 1420,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Diamond Black', 'Crystal Blue'],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['walton', 'primo', 'made-in-bangladesh', '5g', 'budget-phone'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Display: '6.78" Full HD+ IPS 120Hz Refresh Rate',
      Chipset: 'MediaTek Dimensity 6080 5G Octa-Core',
      Camera: '50MP AI Primary + 2MP Depth + 2MP Macro',
      Battery: '5000mAh with 33W Fast Charger Included'
    },
    warranty: '1 Year Walton Official Warranty',
    deliveryDays: 2
  },

  // 53. Electronics - Anker Nano Pro 40W Dual USB-C GaN Charger
  {
    id: 'prod-53',
    title: 'Anker Nano Pro 40W Dual Port USB-C GaN Fast Wall Charger',
    description: 'Ultra-compact high-speed charger capable of delivering up to 40W total output. Fast-charges iPhone 16 up to 50% in just 25 minutes. ActiveShield safety monitoring protects your devices against overheating.',
    category: 'Electronics',
    brand: 'Anker',
    price: 2450,
    originalPrice: 3200,
    discount: 23,
    rating: 4.9,
    reviewCount: 460,
    soldCount: 3100,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['anker', 'charger', 'gan', 'type-c', 'fast-charging', 'accessories'],
    isFlashSale: true,
    freeDelivery: false,
    specifications: {
      Output: '40W Max (Single port 40W or Dual 20W + 20W)',
      Technology: 'GaN II with ActiveShield Dynamic Temperature Sensor',
      Compatibility: 'iPhone, iPad, Samsung Galaxy, MacBook Air, Pixel',
      Weight: '86g (Pocket Sized)'
    },
    warranty: '18 Months Replacement Warranty',
    deliveryDays: 1
  },

  // 54. Audio - JBL Charge 5 Waterproof Bluetooth Speaker
  {
    id: 'prod-54',
    title: 'JBL Charge 5 Portable Waterproof Bluetooth Speaker with Built-in Powerbank',
    description: 'Bold JBL Original Pro Sound with an optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators. Delivers up to 20 hours of playtime and IP67 waterproof and dustproof protection.',
    category: 'Audio',
    brand: 'JBL',
    price: 18500,
    originalPrice: 22000,
    discount: 16,
    rating: 4.9,
    reviewCount: 520,
    soldCount: 1850,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Squad Camo', 'Stealth Black', 'Ocean Blue', 'Fiery Red'],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['jbl', 'speaker', 'bluetooth', 'waterproof', 'audio', 'party'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      OutputPower: '30W RMS Woofer + 10W RMS Tweeter (40W Total)',
      BatteryLife: 'Up to 20 Hours (7500mAh with USB-A Out for Phones)',
      Waterproof: 'IP67 Waterproof & Dustproof',
      PartyBoost: 'Pair 2 JBL PartyBoost speakers for stereo'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 2
  },

  // 55. Electronics - Xiaomi Smart Band 9
  {
    id: 'prod-55',
    title: 'Xiaomi Smart Band 9 (1.62" AMOLED 1200 Nits, 21-Day Battery, SpO2 & Sleep Tracking)',
    description: 'Stunning 60Hz 1.62-inch AMOLED display with auto-brightness up to 1200 nits. Features upgraded multi-channel PPG sensor with 16% improved heart rate accuracy, over 150 sports modes, and metallic finish.',
    category: 'Electronics',
    brand: 'Xiaomi',
    price: 4350,
    originalPrice: 5200,
    discount: 16,
    rating: 4.8,
    reviewCount: 710,
    soldCount: 4200,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Midnight Black', 'Glacier Silver', 'Mystic Rose', 'Arctic Blue'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['fitness-band', 'xiaomi', 'smartwatch', 'amoled', 'health'],
    isFlashSale: true,
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Display: '1.62" AMOLED, 192 x 490, 60Hz, 1200 nits',
      Sensors: 'PPG Heart Rate, SpO2, 3-Axis Accelerometer, Gyroscope',
      WaterResistance: '5 ATM (Up to 50 meters)',
      Battery: '233mAh (Up to 21 days typical use)'
    },
    warranty: '6 Months Official Warranty',
    deliveryDays: 1
  },

  // 56. Electronics - TP-Link Archer AX73 Wi-Fi 6 Router
  {
    id: 'prod-56',
    title: 'TP-Link Archer AX73 AX5400 Dual-Band Gigabit Wi-Fi 6 Router (6 External Antennas)',
    description: 'Blazing fast Wi-Fi 6 speeds up to 5400 Mbps for 8K streaming, high-speed gaming, and concurrent video calls. Features 6 high-gain antennas with Beamforming, 4T4R structure, and HomeShield security.',
    category: 'Electronics',
    brand: 'TP-Link',
    price: 11400,
    originalPrice: 13500,
    discount: 15,
    rating: 4.8,
    reviewCount: 340,
    soldCount: 1450,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['router', 'wifi6', 'tp-link', 'networking', 'gigabit', 'home-office'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Speed: '4804 Mbps on 5GHz + 574 Mbps on 2.4GHz',
      Antennas: '6 High-Performance External Antennas',
      Ports: '1x Gigabit WAN + 4x Gigabit LAN + 1x USB 3.0',
      Coverage: 'Extensive 3-4 Bedroom Houses'
    },
    warranty: '1 Year Replacement Warranty',
    deliveryDays: 2
  },

  // 57. Computers - HP 15s Intel Core i5 12th Gen Laptop
  {
    id: 'prod-57',
    title: 'HP 15s-fq5000 Intel Core i5-1235U Laptop (16GB RAM / 512GB NVMe SSD, 15.6" FHD)',
    description: 'Thin and lightweight productivity laptop engineered for students and professionals. Intel 10-core 12th Gen processor, micro-edge anti-glare Full HD display, long battery life with HP Fast Charge.',
    category: 'Computers',
    brand: 'HP',
    price: 64500,
    originalPrice: 72000,
    discount: 10,
    rating: 4.7,
    reviewCount: 290,
    soldCount: 780,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['hp', 'laptop', 'core-i5', 'computers', 'ssd', 'office-laptop'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Processor: 'Intel Core i5-1235U (10 Cores, 12 Threads, up to 4.4GHz)',
      Memory: '16GB DDR4-3200MHz Dual Channel RAM',
      Storage: '512GB PCIe NVMe M.2 SSD',
      Display: '15.6" Diagonal FHD (1920 x 1080) Micro-Edge IPS'
    },
    warranty: '2 Years Official HP Warranty',
    deliveryDays: 2
  },

  // 58. Computers - Asus TUF Gaming A15
  {
    id: 'prod-58',
    title: 'Asus TUF Gaming A15 (AMD Ryzen 7 7735HS / RTX 4060 8GB / 16GB DDR5 / 144Hz FHD)',
    description: 'Military-grade rugged gaming powerhouse. Equipped with NVIDIA GeForce RTX 4060 GPU with MUX Switch, high-refresh 144Hz display with G-Sync, Arc Flow dual cooling fans, and RGB backlit keyboard.',
    category: 'Computers',
    brand: 'Asus',
    price: 138000,
    originalPrice: 152000,
    discount: 9,
    rating: 4.9,
    reviewCount: 185,
    soldCount: 420,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['asus', 'gaming-laptop', 'rtx4060', 'ryzen7', 'tuf-gaming'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Processor: 'AMD Ryzen 7 7735HS (8 Cores, 16 Threads, up to 4.75GHz)',
      Graphics: 'NVIDIA GeForce RTX 4060 8GB GDDR6 (140W TGP)',
      Display: '15.6" FHD 144Hz IPS 100% sRGB with G-Sync',
      Cooling: 'Dual 84-Blade Arc Flow Fans with 4 Exhaust Vents'
    },
    warranty: '2 Years Asus Global Warranty',
    deliveryDays: 2
  },

  // 59. Computers - Keychron K2 Version 2 Wireless Mechanical Keyboard
  {
    id: 'prod-59',
    title: 'Keychron K2 Version 2 Wireless Mechanical Keyboard (RGB Backlit, Gateron Brown)',
    description: 'Compact 75% layout wireless mechanical keyboard with Mac and Windows layout keycaps included. Connects with up to 3 devices via Bluetooth 5.1 with seamless switching and huge 4000mAh battery.',
    category: 'Computers',
    brand: 'Keychron',
    price: 9200,
    originalPrice: 11000,
    discount: 16,
    rating: 4.9,
    reviewCount: 380,
    soldCount: 1950,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['keyboard', 'mechanical', 'keychron', 'wireless', 'mac-pc'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Layout: '84-Key 75% Compact Layout',
      Switch: 'Gateron G Pro Mechanical Brown Switches',
      Battery: '4000mAh Rechargeable (Up to 240 hours)',
      Frame: 'Solid Aluminum Bezel Construction'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 2
  },

  // 60. Computers - Razer DeathAdder Essential Gaming Mouse
  {
    id: 'prod-60',
    title: 'Razer DeathAdder Essential Ergonomic Gaming Mouse (6400 DPI Optical Sensor)',
    description: 'The proven ergonomic form factor trusted by pro esports gamers worldwide. Features high-precision 6400 DPI optical sensor, durable mechanical switches rated for 10 million clicks, and green LED backlight.',
    category: 'Computers',
    brand: 'Razer',
    price: 2150,
    originalPrice: 2800,
    discount: 23,
    rating: 4.8,
    reviewCount: 920,
    soldCount: 5400,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['razer', 'mouse', 'gaming', 'esports', 'deathadder'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Sensor: 'True 6,400 DPI Optical Sensor',
      Buttons: '5 Independently Programmable Hyperesponse Buttons',
      SwitchDurability: '10 Million Clicks Mechanical Switches',
      Cable: '1.8m Lightweight Braided Fiber Cable'
    },
    warranty: '2 Years Official Razer Warranty',
    deliveryDays: 1
  },

  // 61. Men's Fashion - Aarong Luxury Silk Embroidered Panjabi
  {
    id: 'prod-61',
    title: "Aarong Men's Luxury Handloom Endi Silk Embroidered Festive Panjabi",
    description: 'Exquisite festive Panjabi hand-spun from pure Endi Silk. Features intricate Resham thread needlework along the placket and mandarin collar, tailored in a regal straight-cut silhouette.',
    category: "Men's Fashion",
    brand: 'Aarong',
    price: 6850,
    originalPrice: 8200,
    discount: 16,
    rating: 4.9,
    reviewCount: 410,
    soldCount: 1820,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Festive Mustard', 'Royal Navy', 'Off-White Ivory'],
    sizes: ['38', '40', '42', '44', '46'],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['panjabi', 'aarong', 'silk', 'eid-collection', 'mens-fashion'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Fabric: '100% Handloom Pure Endi Silk',
      Embroidery: 'Hand Needlework with Resham Thread',
      Collar: 'Classic Stiff Mandarin Neckband',
      WashCare: 'Dry Clean Recommended'
    },
    warranty: 'Authentic Handloom Certified',
    deliveryDays: 2
  },

  // 62. Shoes - Apex Genuine Buffalo Leather Formal Derby Shoes
  {
    id: 'prod-62',
    title: "Apex Men's Genuine Buffalo Leather Formal Derby Shoes (Burnished Dark Tan)",
    description: 'Timeless formal elegance. Hand-crafted from full-grain buffalo leather with subtle hand-burnished toe caps, cushioned orthotic inner footbed, and slip-resistant composite rubber dress outsole.',
    category: 'Shoes',
    brand: 'Apex',
    price: 4990,
    originalPrice: 6500,
    discount: 23,
    rating: 4.8,
    reviewCount: 320,
    soldCount: 1640,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Dark Tan', 'Classic Black'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['apex', 'shoes', 'leather-shoes', 'formal-shoes', 'derby'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      UpperMaterial: '100% Full-Grain Natural Buffalo Leather',
      Insole: 'High-Density Memory Foam Cushioning',
      Sole: 'Anti-Slip Textured Rubber Dress Outsole',
      Closure: 'Waxed Cotton Lace-Up Derby Style'
    },
    warranty: '6 Months Manufacturer Guarantee',
    deliveryDays: 2
  },

  // 63. Shoes - Lotto Men's Athletic Running Trainers
  {
    id: 'prod-63',
    title: "Lotto Men's Air-Mesh Shock Absorbing Lightweight Running Shoes",
    description: 'Engineered for morning jogs, gym workouts, and active daily commuting. Features breathable engineered jacquard mesh upper, responsive EVA midsole rebound foam, and abrasion-resistant rubber grip pods.',
    category: 'Shoes',
    brand: 'Lotto',
    price: 2890,
    originalPrice: 3800,
    discount: 24,
    rating: 4.7,
    reviewCount: 460,
    soldCount: 2800,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Black & Neon Orange', 'Slate Grey & Cyan'],
    sizes: ['40', '41', '42', '43', '44'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['lotto', 'running-shoes', 'sneakers', 'sports', 'athletic'],
    freeDelivery: false,
    specifications: {
      Weight: '240g per shoe (Ultra Lightweight)',
      Midsole: 'Responsive Energy-Return Rebound Foam',
      Upper: 'Seamless Jacquard Breathable Knit Mesh',
      Drop: '8mm Heel-to-Toe Drop'
    },
    warranty: '3 Months Stitching Warranty',
    deliveryDays: 2
  },

  // 64. Men's Fashion - Richman Formal Cotton Shirt
  {
    id: 'prod-64',
    title: "Richman Men's 100% Giza Cotton Wrinkle-Resistant Slim Fit Formal Shirt",
    description: 'Woven from fine long-staple Egyptian Giza cotton with an easy-iron silky finish. Features semi-spread collar with removable collar stays, chisel cuffs, and clean single-needle stitching.',
    category: "Men's Fashion",
    brand: 'Richman',
    price: 2190,
    originalPrice: 2850,
    discount: 23,
    rating: 4.8,
    reviewCount: 290,
    soldCount: 1540,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Sky Blue', 'Crisp White', 'Soft Pink'],
    sizes: ['M (15.5)', 'L (16.0)', 'XL (16.5)', 'XXL (17.0)'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['richman', 'shirt', 'formal-shirt', 'cotton', 'office-wear'],
    freeDelivery: false,
    specifications: {
      Material: '100% Long-Staple Giza Cotton (60s Compact Yarn)',
      Fit: 'Slim Tailored Fit with Back Darts',
      Buttons: 'Durable Mother-of-Pearl Finish Resin Buttons',
      Collar: 'Semi-Spread Collar with Removable Stays'
    },
    warranty: '7 Days Exchange Guarantee',
    deliveryDays: 2
  },

  // 65. Men's Fashion - Sailor Chino Trousers
  {
    id: 'prod-65',
    title: "Sailor Men's Stretch Cotton Twill Smart Casual Chino Pants (Khaki Beige)",
    description: 'Modern versatile chinos made with breathable stretch cotton twill for flexible all-day comfort. Features tailored tapered legs, deep front slant pockets, and durable button-through back pockets.',
    category: "Men's Fashion",
    brand: 'Sailor',
    price: 1890,
    originalPrice: 2450,
    discount: 23,
    rating: 4.7,
    reviewCount: 215,
    soldCount: 1280,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Khaki Beige', 'Navy Blue', 'Olive Green', 'Jet Black'],
    sizes: ['30', '32', '34', '36', '38'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['chinos', 'pants', 'sailor', 'casual', 'trousers'],
    freeDelivery: false,
    specifications: {
      Fabric: '97% Combed Cotton, 3% Elastane',
      Fit: 'Smart Tapered Fit',
      Closure: 'Heavy Duty Metal YKK Zipper with Button Fastening'
    },
    warranty: '7 Days Exchange Guarantee',
    deliveryDays: 2
  },

  // 66. Women's Fashion - Traditional Hand-Woven Dhakai Jamdani Saree
  {
    id: 'prod-66',
    title: 'Traditional Hand-Woven Dhakai Jamdani Saree (Royal Midnight Blue with Gold Zari Motif)',
    description: 'Heritage pride of Bangladesh. Meticulously hand-loomed over weeks by master weavers of Narayanganj. Features soft 100-count cotton weave with geometric floral Kalpa motifs woven in rich golden zari.',
    category: "Women's Fashion",
    brand: 'Aarong',
    price: 12500,
    originalPrice: 15500,
    discount: 19,
    rating: 5.0,
    reviewCount: 520,
    soldCount: 1100,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Midnight Blue & Gold', 'Crimson Red & Gold', 'Emerald Green'],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['jamdani', 'saree', 'dhakai-jamdani', 'handloom', 'womens-fashion'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      Length: '12 Haat (Approx 5.5 Meters Saree Length)',
      Material: '100% Fine Hand-Spun Cotton with Zari Threads',
      Craft: 'Traditional Jamdani Weft-Inserted Brocade Pattern',
      Origin: 'Rupganj, Narayanganj, Bangladesh'
    },
    warranty: 'GI Certified Authentic Jamdani',
    deliveryDays: 2
  },

  // 67. Women's Fashion - Aarong Taaga Floral Kurti Set
  {
    id: 'prod-67',
    title: "Aarong Taaga Women's Pastel Floral Printed Cotton Kurti & Flared Palazzo Set",
    description: 'Breezy and graceful summer co-ord set made from 100% pure organic cotton. Features subtle wooden button accents, stylish boat neckline, three-quarter sleeves, and matching wide-leg flared palazzo pants.',
    category: "Women's Fashion",
    brand: 'Taaga',
    price: 3450,
    originalPrice: 4200,
    discount: 18,
    rating: 4.8,
    reviewCount: 380,
    soldCount: 2200,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Pastel Mint', 'Peach Blossom', 'Dusty Rose'],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['kurti', 'palazzo', 'taaga', 'aarong', 'womens-clothing'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Material: '100% Breathable Organic Cotton',
      Includes: '1x Designer Printed Kurti + 1x Flared Palazzo',
      Work: 'Eco-Friendly Screen Print & Wooden Button Detailing'
    },
    warranty: '7 Days Exchange Guarantee',
    deliveryDays: 2
  },

  // 68. Shoes - Bata Women's Memory Foam Slip-On Casual Loafers
  {
    id: 'prod-68',
    title: "Bata Comfit Women's Ultra-Soft Memory Foam Slip-On Loafers (Soft Taupe)",
    description: 'Maximum comfort for teachers, doctors, and working women on their feet all day. Features antimicrobial memory foam insole, flexible stretch vamp collar, and shock-absorbing lightweight PU sole.',
    category: 'Shoes',
    brand: 'Bata',
    price: 2490,
    originalPrice: 3200,
    discount: 22,
    rating: 4.8,
    reviewCount: 610,
    soldCount: 3400,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Soft Taupe', 'Jet Black', 'Pearl Beige'],
    sizes: ['36', '37', '38', '39', '40'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['bata', 'loafers', 'women-shoes', 'comfit', 'memory-foam'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Insole: 'Orthopedic Cushioning High-Density Memory Foam',
      Upper: 'Soft Premium Synthetic Leather with Perforated Accents',
      Sole: 'Direct Injected Featherlight PU Outsole'
    },
    warranty: '3 Months Replacement Guarantee',
    deliveryDays: 2
  },

  // 69. Accessories - Apex Leather RFID Protected Men's Wallet
  {
    id: 'prod-69',
    title: "Apex Handcrafted 100% Genuine Oily Leather Bifold Wallet with RFID Shield",
    description: 'Crafted from oily pull-up cowhide leather that develops a richer patina with age. Features built-in military grade RFID blocking lining to guard your credit and debit cards against electronic theft.',
    category: 'Accessories',
    brand: 'Apex',
    price: 1490,
    originalPrice: 1950,
    discount: 24,
    rating: 4.9,
    reviewCount: 780,
    soldCount: 4600,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Vintage Brown', 'Matte Black', 'Chestnut Tan'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['wallet', 'leather-wallet', 'apex', 'rfid', 'accessories'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Material: '100% Full Grain Natural Cow Leather',
      Slots: '8 Card Slots, 2 Cash Dividers, 1 Transparent ID Window, 1 Coin Pocket',
      Security: 'RFID 13.56 MHz Anti-Skimming Shield'
    },
    warranty: '1 Year Stitching & Leather Guarantee',
    deliveryDays: 1
  },

  // 70. Home Appliances - Walton Inverter Frost-Free Refrigerator 320L
  {
    id: 'prod-70',
    title: 'Walton 320L Double Door Frost-Free Refrigerator with Intelligent Inverter Technology',
    description: 'Keep groceries fresh for up to 30 days. Features 100% copper condenser, Nano-Silver antibacterial deodorizer, digital temperature display, and ultra-quiet intelligent inverter compressor saving up to 60% energy.',
    category: 'Home Appliances',
    brand: 'Walton',
    price: 49500,
    originalPrice: 58000,
    discount: 15,
    rating: 4.8,
    reviewCount: 230,
    soldCount: 680,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['refrigerator', 'walton', 'inverter', 'home-appliance', 'frost-free'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Capacity: '320 Liters Net Gross Volume',
      Compressor: 'Intelligent Inverter (R600a Eco Refrigerant)',
      Condenser: '100% Pure Copper Tubing',
      Lighting: 'Ultra-Bright LED Interior Light'
    },
    warranty: '12 Years Compressor Official Warranty',
    deliveryDays: 2
  },

  // 71. Home Appliances - Singer 1.5 Ton Dual Inverter Split AC
  {
    id: 'prod-71',
    title: 'Singer 1.5 Ton Dual Inverter Energy Saving Split Air Conditioner (Golden Fin & Wi-Fi)',
    description: 'Rapid 30-second turbo cooling engineered for tropical summer heat. 100% copper tube condenser with anti-corrosion Golden Fin coating, 4-in-1 active air filter removing PM2.5 pollutants, and smart Wi-Fi control.',
    category: 'Home Appliances',
    brand: 'Singer',
    price: 58500,
    originalPrice: 69000,
    discount: 15,
    rating: 4.8,
    reviewCount: 310,
    soldCount: 890,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1614633837728-68e826b1c099?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Singer Bangladesh Official',
    tags: ['ac', 'air-conditioner', 'singer', 'inverter-ac', '1.5-ton'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      CoolingCapacity: '18000 BTU/hr (1.5 Ton)',
      EnergySaving: 'Dual Inverter Technology with up to 70% Power Savings',
      Coating: 'Golden Fin Anti-Corrosive Hydrophilic Coating',
      Refrigerant: 'Eco-Friendly R32 Gas'
    },
    warranty: '10 Years Compressor Warranty & 2 Years Free Service',
    deliveryDays: 2
  },

  // 72. Home Appliances - Prestige Deluxe Alpha Stainless Steel Pressure Cooker 5L
  {
    id: 'prod-72',
    title: 'Prestige Deluxe Alpha Induction Base Stainless Steel Pressure Cooker (5 Litres)',
    description: 'Heavy gauge 304 food-grade stainless steel body with unique Alpha induction base that distributes heat evenly without burning food. Controlled gasket release system and durable pressure indicator.',
    category: 'Home Appliances',
    brand: 'Prestige',
    price: 4650,
    originalPrice: 5800,
    discount: 20,
    rating: 4.9,
    reviewCount: 480,
    soldCount: 2900,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1585672840452-f1e16fdf06a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Singer Bangladesh Official',
    tags: ['pressure-cooker', 'prestige', 'kitchen', 'cookware', 'stainless-steel'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Capacity: '5 Litres (Suitable for 4-7 persons)',
      Material: 'High Quality AISI 304 Food-Grade Stainless Steel',
      Base: 'Alpha Induction Compatible Sandwich Bottom Base',
      Safety: 'Controlled Gasket Release System & Metallic Safety Plug'
    },
    warranty: '5 Years Brand Warranty',
    deliveryDays: 2
  },

  // 73. Home Appliances - Panasonic Super Mixer Grinder 750W
  {
    id: 'prod-73',
    title: 'Panasonic 750W Heavy-Duty Super Mixer Grinder with 3 Stainless Steel Jars',
    description: 'Grind tough turmeric, masala, smoothies, and batter effortlessly. Powered by a 100% pure copper heavy-duty 750W motor with circuit breaker protection, 304 stainless steel samurai edge blades.',
    category: 'Home Appliances',
    brand: 'Panasonic',
    price: 8400,
    originalPrice: 10500,
    discount: 20,
    rating: 4.9,
    reviewCount: 390,
    soldCount: 1720,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Singer Bangladesh Official',
    tags: ['mixer-grinder', 'panasonic', 'blender', 'kitchen-appliance', 'masala'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      MotorPower: '750 Watts Pure Copper Heavy Duty Motor',
      Jars: '1.5L Wet Jar + 1.0L Multi-Jar + 0.4L Chutney Chutney Grinder',
      Blades: '304 Grade Hardened Stainless Steel Samurai Edge Blades',
      Safety: 'Double Safety Interlocking Lid System'
    },
    warranty: '5 Years Motor Official Warranty',
    deliveryDays: 2
  },

  // 74. Beauty - CeraVe Moisturizing Cream for Dry to Very Dry Skin
  {
    id: 'prod-74',
    title: 'CeraVe Moisturizing Cream with 3 Essential Ceramides & Hyaluronic Acid (454g Jar with Pump)',
    description: 'Dermatologist developed rich, non-greasy moisturizing cream. Formulated with 3 essential ceramides (1, 3, 6-II) and MVE Delivery Technology for controlled 24-hour continuous skin barrier hydration.',
    category: 'Beauty',
    brand: 'CeraVe',
    price: 2650,
    originalPrice: 3400,
    discount: 22,
    rating: 5.0,
    reviewCount: 940,
    soldCount: 5200,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['cerave', 'skincare', 'moisturizer', 'beauty', 'ceramides'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Volume: '454g (16 oz) Tub with Convenient Pump',
      KeyIngredients: 'Ceramides 1, 3, 6-II, Hyaluronic Acid, Glycerin',
      SkinType: 'Dry to Very Dry & Sensitive Skin',
      Certification: 'Fragrance-Free, Non-Comedogenic, Allergy Tested'
    },
    warranty: '100% Authentic Import Guarantee',
    deliveryDays: 1
  },

  // 75. Beauty - The Ordinary Niacinamide 10% + Zinc 1%
  {
    id: 'prod-75',
    title: 'The Ordinary Niacinamide 10% + Zinc 1% High-Strength Vitamin & Mineral Blemish Serum (60ml)',
    description: 'Cult-favorite water-based facial serum proven to reduce the appearance of skin blemishes, congestion, and visible sebum oil production while brightening skin tone and texture.',
    category: 'Beauty',
    brand: 'The Ordinary',
    price: 1550,
    originalPrice: 2100,
    discount: 26,
    rating: 4.8,
    reviewCount: 1120,
    soldCount: 6800,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1608248597359-59892c57849e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['the-ordinary', 'niacinamide', 'serum', 'skincare', 'acne'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Volume: '60ml (Super Value Jumbo Size)',
      KeyActives: '10% Niacinamide (Vitamin B3) + 1% Zinc PCA',
      TargetConcerns: 'Excess Sebum Shine, Enlarged Pores, Uneven Tone',
      Origin: 'Authentic Deciem Made in Canada'
    },
    warranty: 'Batch Code Verified Authentic',
    deliveryDays: 1
  },

  // 76. Beauty - Philips Series 7000 14-in-1 Multi Grooming Trimmer
  {
    id: 'prod-76',
    title: 'Philips Multigroom Series 7000 14-in-1 All-in-One Face, Hair & Body Trimmer (DualCut)',
    description: 'Ultimate precision styling for beard, head hair and body grooming. DualCut self-sharpening stainless steel blades that never need oiling, 120 minutes of cordless runtime per 1-hour fast charge, and fully showerproof.',
    category: 'Beauty',
    brand: 'Philips',
    price: 5200,
    originalPrice: 6500,
    discount: 20,
    rating: 4.9,
    reviewCount: 630,
    soldCount: 3100,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Singer Bangladesh Official',
    tags: ['trimmer', 'philips', 'grooming', 'shaver', 'mens-care'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Attachments: '14 Styling Tools including Precision Metal Trimmer, Body Shaver, Nose/Ear Trimmer',
      Blades: 'DualCut Self-Sharpening Steel Blades (No Oil Needed)',
      Battery: 'Lithium-Ion with 120 Mins Run Time / 1 Hr Charge',
      Waterproof: '100% Showerproof Easy Rinse Body'
    },
    warranty: '2 Years Philips Worldwide Guarantee',
    deliveryDays: 1
  },

  // 77. Sports - Yonex Muscle Power 29 Light Badminton Racket
  {
    id: 'prod-77',
    title: 'Yonex Muscle Power 29 Light Full Graphite Badminton Racket (Strung with Full Cover)',
    description: 'Isometric head shape creates a 7% larger sweet spot for powerful smashes and precision drop shots. High-modulus graphite construction with shockless grommet system, strung with BG65 titanium string.',
    category: 'Sports',
    brand: 'Yonex',
    price: 3850,
    originalPrice: 4800,
    discount: 20,
    rating: 4.8,
    reviewCount: 380,
    soldCount: 1980,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['yonex', 'badminton', 'racket', 'sports', 'fitness'],
    freeDelivery: true,
    specifications: {
      Weight: '4U (83g - Lightweight & Agile)',
      Tension: 'Pre-Strung at 24 lbs (Supports up to 30 lbs)',
      Frame: 'HM Full Graphite with Muscle Power Frame',
      Includes: 'Full Length Padded Yonex Thermal Racket Cover'
    },
    warranty: '100% Genuine Yonex with Hologram',
    deliveryDays: 2
  },

  // 78. Sports - Domyos 8mm Eco-Friendly Yoga & Fitness Mat
  {
    id: 'prod-78',
    title: 'Domyos Non-Slip Eco-Friendly 8mm Extra Thick Yoga & Workout Mat with Carrying Strap',
    description: 'Designed for home workouts, pilates, and yoga postures. Premium high-density TPE dual-textured non-slip surface provides superior joint cushioning for knees, elbows, and spine.',
    category: 'Sports',
    brand: 'Domyos',
    price: 1650,
    originalPrice: 2200,
    discount: 25,
    rating: 4.8,
    reviewCount: 410,
    soldCount: 2350,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Plum Purple', 'Teal Green', 'Ocean Navy'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['yoga-mat', 'workout', 'fitness', 'domyos', 'sports'],
    freeDelivery: false,
    specifications: {
      Thickness: '8mm Extra Cushioning Dual Layer',
      Dimensions: '183 cm x 61 cm (Full Adult Length)',
      Material: 'Eco-Friendly Biodegradable TPE (PVC & Latex Free)',
      Included: 'Elastic Shoulder Carrying Sling Strap'
    },
    warranty: '6 Months Durability Warranty',
    deliveryDays: 2
  },

  // 79. Grocery - Pran Chinigura Premium Aromatic Rice 5kg
  {
    id: 'prod-79',
    title: 'Pran Chinigura Premium Aromatic Rice (5kg Airtight Vacuum Foil Pack)',
    description: 'Naturally aged pure Chinigura polao rice harvested from the fertile soils of Dinajpur. Known for its small, delicate grains, natural sweet aroma, and fluffy non-sticky texture ideal for Biryani, Polao, and Firni.',
    category: 'Grocery',
    brand: 'Pran',
    price: 790,
    originalPrice: 920,
    discount: 14,
    rating: 4.9,
    reviewCount: 890,
    soldCount: 8400,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['rice', 'chinigura', 'grocery', 'pran', 'polao-chal', 'food'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      NetWeight: '5 Kilograms',
      GrainType: 'Naturally Aged Dinajpur Chinigura Aromatic Rice',
      Packaging: 'Nitrogen-Flushed 5-Layer Airtight Moisture-Proof Poly Bag'
    },
    warranty: '100% Purity & Freshness Guaranteed',
    deliveryDays: 1
  },

  // 80. Grocery - Radhuni Pure Cold Pressed Mustard Oil 1L
  {
    id: 'prod-80',
    title: 'Radhuni Pure Cold Pressed Mustard Oil (1 Liter Sealed Tin Container)',
    description: 'Extracted from selected grade-A mustard seeds using traditional cold-press cold-filtration technology. Delivers rich pungency (Jhajh), natural antioxidants, and authentic taste for fish curries, bhorta, and pickles.',
    category: 'Grocery',
    brand: 'Radhuni',
    price: 360,
    originalPrice: 420,
    discount: 14,
    rating: 4.9,
    reviewCount: 640,
    soldCount: 7200,
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['mustard-oil', 'radhuni', 'grocery', 'cooking-oil', 'shorsher-tel'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Volume: '1 Liter',
      Extraction: 'Cold-Pressed Ghani Grade Seeds',
      Packaging: 'Food-Grade Sealed Tin Container to preserve pungency'
    },
    warranty: 'BSTI Certified 100% Pure',
    deliveryDays: 1
  },

  // 81. Watches - Fossil Grant Chronograph Leather Watch
  {
    id: 'prod-81',
    title: "Fossil Men's Grant Chronograph Brown Leather Watch (FS4813)",
    description: 'Inspired by vintage clocks. Features a round stainless steel case with Roman numeral hour markers, three sub-dials for 24-hour time and stopwatch seconds, and genuine supple brown leather strap.',
    category: 'Watches',
    brand: 'Fossil',
    price: 14500,
    originalPrice: 18000,
    discount: 19,
    rating: 4.8,
    reviewCount: 310,
    soldCount: 940,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['fossil', 'watch', 'chronograph', 'leather-watch', 'accessories'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      CaseSize: '44mm Stainless Steel Case with Mineral Crystal',
      BandWidth: '22mm Genuine Calfskin Leather with Buckle',
      Movement: 'Quartz Chronograph with Stop Watch Sub-Dials',
      WaterResistance: '5 ATM (50m Splash and Rain Resistant)'
    },
    warranty: '2 Years Official International Warranty',
    deliveryDays: 2
  },

  // 82. Electronics - Joyroom Magnetic 15W Wireless Power Bank 10000mAh
  {
    id: 'prod-82',
    title: 'Joyroom MagSafe Magnetic 15W Fast Wireless Power Bank 10000mAh with Foldable Kickstand',
    description: 'Snaps firmly to iPhone 12/13/14/15/16 with ultra-strong N52 neodymium magnets. Delivers 15W wireless charging + 20W PD Type-C wired fast charge with integrated zinc alloy landscape/portrait desk kickstand.',
    category: 'Electronics',
    brand: 'Joyroom',
    price: 2850,
    originalPrice: 3800,
    discount: 25,
    rating: 4.7,
    reviewCount: 430,
    soldCount: 2600,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Space Gray', 'Alpine White', 'Ice Blue'],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['powerbank', 'magsafe', 'wireless-charger', 'joyroom', 'fast-charging'],
    isFlashSale: true,
    freeDelivery: false,
    specifications: {
      Capacity: '10000mAh / 38.5Wh High Density Li-Polymer',
      WirelessOutput: '5W / 7.5W / 10W / 15W Max',
      WiredOutput: 'USB-C PD 20W Fast Charge',
      Feature: 'Foldable Multi-Angle Kickstand'
    },
    warranty: '6 Months Replacement Warranty',
    deliveryDays: 1
  },

  // 83. Computers - SanDisk Extreme PRO 128GB SDXC Memory Card
  {
    id: 'prod-83',
    title: 'SanDisk Extreme PRO 128GB SDXC UHS-I Memory Card (Up to 200MB/s, V30, 4K UHD)',
    description: 'Top choice for DSLR and mirrorless camera videographers. Blazing read speeds up to 200MB/s powered by SanDisk QuickFlow Technology. UHS Speed Class 3 (U3) and Video Speed Class 30 (V30) for uninterrupted 4K video.',
    category: 'Computers',
    brand: 'SanDisk',
    price: 2950,
    originalPrice: 3900,
    discount: 24,
    rating: 4.9,
    reviewCount: 510,
    soldCount: 3200,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['sandisk', 'memory-card', 'sd-card', 'camera', '4k-video'],
    freeDelivery: false,
    specifications: {
      Capacity: '128GB Storage',
      ReadSpeed: 'Up to 200 MB/s',
      WriteSpeed: 'Up to 90 MB/s',
      Durability: 'Temperature-proof, waterproof, shockproof, and x-ray-proof'
    },
    warranty: 'Lifetime Official Warranty',
    deliveryDays: 1
  },

  // 84. Computers - Ugreen 9-in-1 USB-C Hub Docking Station
  {
    id: 'prod-84',
    title: 'Ugreen 9-in-1 USB-C Hub Docking Station (4K 60Hz HDMI, 100W PD, Gigabit Ethernet, 3x USB 3.0)',
    description: 'Transform a single Type-C port on your MacBook, Dell XPS, or ThinkPad into 9 powerful ports. Features 4K@60Hz HDMI output, 1000Mbps Gigabit RJ45 LAN, SD/TF card readers, and 100W Power Delivery pass-through.',
    category: 'Computers',
    brand: 'Ugreen',
    price: 4850,
    originalPrice: 6200,
    discount: 22,
    rating: 4.8,
    reviewCount: 340,
    soldCount: 1850,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['ugreen', 'hub', 'type-c-hub', 'docking-station', 'hdmi-4k'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Ports: '1x HDMI 4K@60Hz, 1x Gigabit Ethernet, 1x USB-C PD 100W, 3x USB-A 3.0, 1x SD/TF',
      Casing: 'Aerospace Grade Aluminum Alloy Casing for Efficient Heat Dissipation',
      Compatibility: 'MacBook Pro/Air, iPad Pro, Windows, ChromeOS'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 1
  },

  // 85. Computers - Dell UltraSharp 27" 4K USB-C Hub Monitor
  {
    id: 'prod-85',
    title: 'Dell UltraSharp 27" 4K USB-C Hub Monitor (U2723QE, IPS Black 2000:1 Contrast, 98% DCI-P3)',
    description: 'Engineered for color-critical photo and video editing. Groundbreaking IPS Black technology with exceptional 2000:1 contrast ratio, 4K UHD resolution, VESA DisplayHDR 400, and 90W USB-C single-cable power delivery.',
    category: 'Computers',
    brand: 'Dell',
    price: 68500,
    originalPrice: 78000,
    discount: 12,
    rating: 5.0,
    reviewCount: 140,
    soldCount: 390,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['dell', 'ultrasharp', 'monitor', '4k-monitor', 'ips-black', 'color-accurate'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Panel: '27" IPS Black Technology, 3840 x 2160 at 60Hz',
      ColorAccuracy: '98% DCI-P3, 100% sRGB, Delta E < 2 Factory Calibrated',
      Connectivity: 'USB-C (90W PD), DisplayPort 1.4, HDMI 2.0, RJ45 LAN, 5x USB 3.2 Gen 2',
      Stand: 'Height-Adjustable, Tilt, Swivel, and 90-Degree Pivot'
    },
    warranty: '3 Years Dell Official Warranty',
    deliveryDays: 2
  },

  // 86. Mobile Phones - Vivo V30 5G
  {
    id: 'prod-86',
    title: 'Vivo V30 5G (12GB RAM / 256GB ROM, Peacock Green, Studio-Quality Aura Light)',
    description: 'Ultra-slim 7.45mm 3D curved body holding a massive 5000mAh battery. Features upgraded Smart Aura Light Portrait 2.0, dual 50MP VCS true color rear cameras, and 50MP autofocus eye-tracking selfie camera.',
    category: 'Mobile Phones',
    brand: 'Vivo',
    price: 54999,
    originalPrice: 59999,
    discount: 8,
    rating: 4.8,
    reviewCount: 380,
    soldCount: 1420,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Peacock Green', 'Lush Brown', 'Waving Aqua'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['vivo', 'v30', 'smartphone', 'aura-light', '5g', 'selfie'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Display: '6.78" 1.5K AMOLED 120Hz 2800 nits Peak Brightness',
      Processor: 'Qualcomm Snapdragon 7 Gen 3 (4nm TSMC)',
      Camera: '50MP OIS VCS True Color + 50MP AF Ultra Wide + 50MP AF Front',
      Charging: '80W FlashCharge with 5000mAh Battery'
    },
    warranty: '1 Year Brand Warranty',
    deliveryDays: 2
  },

  // 87. Mobile Phones - Infinix Note 40 Pro
  {
    id: 'prod-87',
    title: 'Infinix Note 40 Pro (Vintage Green Vegan Leather, 12GB RAM / 256GB, 70W FastCharge)',
    description: 'All-Round FastCharge 2.0 with 70W Multi-Speed Wired FastCharge and 20W Wireless MagCharge. Ultra-smooth 120Hz 3D curved AMOLED display with Corning Gorilla Glass and 108MP OIS super-zoom camera.',
    category: 'Mobile Phones',
    brand: 'Infinix',
    price: 34999,
    originalPrice: 38999,
    discount: 10,
    rating: 4.7,
    reviewCount: 420,
    soldCount: 2300,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Vintage Green', 'Titan Gold'],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['infinix', 'note-40-pro', 'magcharge', 'curved-amoled', 'budget-flagship'],
    freeDelivery: true,
    specifications: {
      Display: '6.78" 3D Curved AMOLED 120Hz In-Display Fingerprint',
      Chipset: 'MediaTek Helio G99 Ultimate (6nm)',
      Charging: '70W Wired + 20W Wireless MagCharge Power Bank Included in Box',
      Audio: 'Dual Speakers with Sound by JBL'
    },
    warranty: '1 Year Official Warranty',
    deliveryDays: 2
  },

  // 88. Women's Fashion - Artisan Embroidered Pure Georgette Party Gown
  {
    id: 'prod-88',
    title: 'Artisan Embroidered Pure Georgette Semi-Stitched Anarkali Party Gown (Pastel Lavender)',
    description: 'Regal festive elegance for weddings and special evening celebrations. Features floor-length flare crafted from premium flowy georgette, embellished with intricate mirror work, sequence, and thread embroidery.',
    category: "Women's Fashion",
    brand: 'Aarong',
    price: 7850,
    originalPrice: 9800,
    discount: 20,
    rating: 4.9,
    reviewCount: 260,
    soldCount: 890,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Pastel Lavender', 'Emerald Teal', 'Powder Blue'],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['gown', 'anarkali', 'party-wear', 'womens-fashion', 'wedding'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      Fabric: 'Pure Heavy Fox Georgette with Santoon Inner Lining',
      Work: 'Mirror Handwork, Zari Cord Embroidery, and Sequence Detailing',
      Flare: '3.5 Meters Full Umbrella Circle Flare',
      Dupatta: 'Matching Fox Georgette Dupatta with 4-Side Cutwork Lace'
    },
    warranty: '7 Days Return Guarantee',
    deliveryDays: 2
  },

  // 89. Women's Fashion - Monalisa Heavy Embroidered Cotton 3-Piece Salwar Kameez
  {
    id: 'prod-89',
    title: "Monalisa Unstitched Heavy Embroidered Pure Cotton 3-Piece Salwar Suit Collection",
    description: '100% fine cotton lawn kameez with rich Kashmiri floral neckline embroidery, paired with a soft digital printed Malmal cotton dupatta and matching comfortable cotton salwar fabric.',
    category: "Women's Fashion",
    brand: 'Monalisa',
    price: 2450,
    originalPrice: 3200,
    discount: 23,
    rating: 4.8,
    reviewCount: 490,
    soldCount: 3100,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Mustard Yellow', 'Crimson Red', 'Royal Blue', 'Pistachio Green'],
    sellerId: 'seller-3',
    sellerName: 'Aarong Artisan Living',
    tags: ['three-piece', 'salwar-kameez', 'cotton-dress', 'monalisa', 'womens-wear'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Kameez: '2.5 Meters Fine Pure Cotton with Neckline Embroidery',
      Salwar: '2.5 Meters Solid Dye Breathable Cotton Fabric',
      Dupatta: '2.5 Meters Lightweight Soft Malmal Digital Printed Dupatta'
    },
    warranty: 'Color & Shrinkage Tested',
    deliveryDays: 2
  },

  // 90. Accessories - Cat's Eye Women's Premium Designer Handbag
  {
    id: 'prod-90',
    title: "Cat's Eye Women's Elegant Structured Vegan Leather Handbag with Gold Hardware",
    description: 'Polished silhouette that transitions effortlessly from boardroom to dinner. Crafted from scratch-resistant saffiano vegan leather with dual rolled handles, zippered center divider, and detachable shoulder strap.',
    category: 'Accessories',
    brand: "Cat's Eye",
    price: 3250,
    originalPrice: 4200,
    discount: 23,
    rating: 4.8,
    reviewCount: 360,
    soldCount: 1740,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Burgundy Wine', 'Classic Black', 'Tan Caramel'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['handbag', 'tote', 'womens-bag', 'purse', 'accessories'],
    freeDelivery: true,
    specifications: {
      Material: 'Premium Scratch-Resistant Textured Saffiano Faux Leather',
      Dimensions: '32cm (W) x 24cm (H) x 13cm (D)',
      Hardware: 'Tarnish-Resistant Polished Light Gold Plated Hardware',
      Strap: 'Detachable & Adjustable 120cm Crossbody Shoulder Strap'
    },
    warranty: '6 Months Hardware Guarantee',
    deliveryDays: 2
  },

  // 91. Home & Living - Tefal Non-Stick 5-Piece Cookware Set
  {
    id: 'prod-91',
    title: 'Tefal Ingenio Non-Stick 5-Piece Induction Cookware Set with Thermo-Signal',
    description: 'Cook like a master chef with less oil. Features Tefal patented Titanium non-stick coating that lasts 3X longer, patented Thermo-Signal heat indicator turns solid red at ideal searing temperature, and induction base.',
    category: 'Home & Living',
    brand: 'Tefal',
    price: 8900,
    originalPrice: 11500,
    discount: 23,
    rating: 4.9,
    reviewCount: 280,
    soldCount: 960,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1585672840452-f1e16fdf06a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-3',
    sellerName: 'Singer Bangladesh Official',
    tags: ['tefal', 'cookware', 'non-stick', 'pots-and-pans', 'kitchen'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      SetIncludes: '24cm Frypan, 28cm Wok Kadai with Glass Lid, 20cm Saucepan with Lid',
      Coating: '100% Safe Titanium Mineral Non-Stick (PFOA, Lead, Cadmium Free)',
      Compatibility: 'All Hobs including Gas, Electric, Ceramic, and Induction'
    },
    warranty: '2 Years International Official Warranty',
    deliveryDays: 2
  },

  // 92. Home Appliances - Xiaomi Smart Air Purifier 4 Compact
  {
    id: 'prod-92',
    title: 'Xiaomi Smart Air Purifier 4 Compact (True HEPA Filter, Whisper Quiet 20dB, Mi Home App)',
    description: 'Clean, pollen-free air for bedroom and home office. Captures 99.97% of particles as small as 0.3 microns including smoke, dust mites, pet dander, and odors with low energy consumption of only 27W.',
    category: 'Home Appliances',
    brand: 'Xiaomi',
    price: 9900,
    originalPrice: 12500,
    discount: 21,
    rating: 4.9,
    reviewCount: 350,
    soldCount: 1600,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['air-purifier', 'xiaomi', 'hepa-filter', 'smart-home', 'clean-air'],
    isMall: true,
    freeDelivery: true,
    specifications: {
      EffectiveArea: 'Up to 27 m² (Suitable for Bedrooms and Study Rooms)',
      CADR: '230 m³/h Particulate CADR',
      NoiseLevel: 'As Low As 20dB in Night Sleep Mode',
      AppControl: 'Real-time AQI Air Quality Monitoring via Xiaomi Home App'
    },
    warranty: '1 Year Replacement Warranty',
    deliveryDays: 2
  },

  // 93. Beauty - Tresemme Keratin Smooth Professional Combo
  {
    id: 'prod-93',
    title: 'Tresemme Keratin Smooth Salon Professional Shampoo (580ml) & Conditioner (340ml) Combo',
    description: 'Infused with keratin protein and lightweight marula oil. Tames frizz for up to 72 hours, detangles knots, boosts salon-like shine, and leaves hair silky smooth even in humid monsoon weather.',
    category: 'Beauty',
    brand: 'Tresemme',
    price: 1350,
    originalPrice: 1750,
    discount: 23,
    rating: 4.8,
    reviewCount: 780,
    soldCount: 4900,
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-2',
    sellerName: 'Walton Tech Hub',
    tags: ['tresemme', 'shampoo', 'conditioner', 'keratin', 'haircare', 'combo'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      Includes: '1x Keratin Smooth Shampoo 580ml + 1x Keratin Smooth Conditioner 340ml',
      ActiveFormulation: 'Keratin Protein Complex with African Marula Oil',
      Benefit: 'Up to 72 Hours Anti-Frizz Control with Micro-Moisture'
    },
    warranty: '100% Genuine Unilever Product',
    deliveryDays: 1
  },

  // 94. Sports - Decathlon 5-Piece Resistance Exercise Loop Bands Set
  {
    id: 'prod-94',
    title: 'Decathlon Corength 5-Piece Natural Latex Resistance Exercise Loop Bands with Pouch',
    description: 'Comprehensive 5-level resistance band kit (X-Light to X-Heavy) for glute activation, strength training, rehabilitation, yoga, and calorie burning workouts at home or on travels.',
    category: 'Sports',
    brand: 'Decathlon',
    price: 850,
    originalPrice: 1200,
    discount: 29,
    rating: 4.8,
    reviewCount: 520,
    soldCount: 3800,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['resistance-bands', 'fitness', 'workout', 'decathlon', 'gym'],
    freeDelivery: false,
    specifications: {
      Material: '100% Natural Eco-Friendly Malaysian Latex (Snap Resistant)',
      Levels: '5 Color-Coded Levels: 5 lbs, 10 lbs, 15 lbs, 20 lbs, and 30 lbs',
      Included: '5 Exercise Bands, Instructional Exercise Guide, Breathable Mesh Carry Pouch'
    },
    warranty: '6 Months Snap Resistance Guarantee',
    deliveryDays: 1
  },

  // 95. Watches - Casio G-Shock Carbon Core Guard Watch
  {
    id: 'prod-95',
    title: 'Casio G-Shock Carbon Core Guard Octagonal Bezel All-Black Watch (GA-2100-1A1 "CasiOak")',
    description: 'The ultra-popular slim "CasiOak" icon. Carbon Core Guard structure protects the internal module by enclosing it in a carbon fiber-reinforced resin case. Shock resistant, 200m water resistant, and double LED illuminator.',
    category: 'Watches',
    brand: 'Casio',
    price: 13900,
    originalPrice: 16500,
    discount: 16,
    rating: 5.0,
    reviewCount: 840,
    soldCount: 3100,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    sellerId: 'seller-4',
    sellerName: 'Xiaomi Authorized BD',
    tags: ['gshock', 'casio', 'casioak', 'watch', 'waterproof', 'black'],
    isMall: true,
    isBestSeller: true,
    freeDelivery: true,
    specifications: {
      CaseSize: '48.5 × 45.4 × 11.8 mm (Slimmest G-Shock Series)',
      Structure: 'Carbon Core Guard with Shock Resistance & Mineral Glass',
      WaterResistance: '200-Meter (20 Bar) Water Resistance',
      Functions: 'World Time 31 Time Zones, 1/100s Stopwatch, 5 Daily Alarms, Hand Shift'
    },
    warranty: '2 Years Official Casio Warranty',
    deliveryDays: 1
  },

  // 96. Shoes - Apex Men's Handcrafted Leather Sandal
  {
    id: 'prod-96',
    title: "Apex Men's Handcrafted Genuine Pull-Up Leather Casual Slip-On Slide Sandals",
    description: 'Traditional handcrafted comfort for everyday leisure and Friday prayer wear. Features genuine pull-up cowhide leather straps with soft microfiber lining and anatomical contoured footbed.',
    category: 'Shoes',
    brand: 'Apex',
    price: 2490,
    originalPrice: 3200,
    discount: 22,
    rating: 4.8,
    reviewCount: 560,
    soldCount: 3800,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Rustic Brown', 'Classic Black'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    sellerId: 'seller-1',
    sellerName: 'Apex Footwear Official',
    tags: ['sandals', 'apex', 'leather-sandals', 'slides', 'mens-footwear'],
    isBestSeller: true,
    freeDelivery: false,
    specifications: {
      UpperMaterial: '100% Genuine Oil Pull-Up Cow Leather',
      Insole: 'Cushioned Ergonomic Footbed with Arch Support',
      Outsole: 'Durable Anti-Skid Ribbed Rubber Outsole'
    },
    warranty: '6 Months Adhesive & Stitching Guarantee',
    deliveryDays: 2
  }
];
