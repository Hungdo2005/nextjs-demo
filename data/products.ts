export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    image: "/images/headphones.svg",
    description: "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    price: 199.99,
    category: "Audio",
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    image: "/images/keyboard.svg",
    description: "Compact RGB mechanical keyboard featuring hot-swappable tactile switches and aluminum chassis.",
    price: 89.99,
    category: "Gaming",
  },
  {
    id: 3,
    name: "Ergonomic Precision Mouse",
    image: "/images/mouse.svg",
    description: "Wireless ergonomic mouse with high-precision optical sensor and customizable macro buttons.",
    price: 49.99,
    category: "Peripherals",
  },
  {
    id: 4,
    name: "Ultra-Wide 4K Gaming Monitor",
    image: "/images/monitor.svg",
    description: "34-inch curved gaming display with 144Hz refresh rate and vibrant HDR color reproduction.",
    price: 499.99,
    category: "Displays",
  },
  {
    id: 5,
    name: "Studio Recording Condenser Mic",
    image: "/images/microphone.svg",
    description: "Professional USB condenser microphone perfect for streaming, podcasting, and voiceover work.",
    price: 79.99,
    category: "Audio",
  },
  {
    id: 6,
    name: "Smart Fitness Activity Watch",
    image: "/images/smartwatch.svg",
    description: "Water-resistant smartwatch with real-time heart rate tracking, GPS, and multi-sport workout modes.",
    price: 129.99,
    category: "Wearables",
  },
  {
    id: 7,
    name: "Pro Titanium 16-Inch Laptop",
    image: "/images/laptop.svg",
    description: "High-performance laptop featuring ultra-fast multi-core processing, 32GB unified RAM, and liquid retina display.",
    price: 1899.99,
    category: "Computers",
  },
  {
    id: 8,
    name: "Flagship 5G OLED Smartphone",
    image: "/images/smartphone.svg",
    description: "Next-gen flagship smartphone with 120Hz dynamic AMOLED display, AI triple camera system, and all-day battery life.",
    price: 999.99,
    category: "Mobile",
  },
  {
    id: 9,
    name: "Ultra-Slim Stylus Pro Tablet",
    image: "/images/tablet.svg",
    description: "Lightweight 11-inch creative tablet with responsive stylus pen support, vivid color gamut, and magnetic keyboard dock.",
    price: 649.99,
    category: "Computers",
  },
  {
    id: 10,
    name: "Waterproof Hi-Fi Bluetooth Speaker",
    image: "/images/speaker.svg",
    description: "Rugged IPX7 waterproof portable speaker with 360-degree immersive spatial audio and 24-hour continuous playtime.",
    price: 149.99,
    category: "Audio",
  },
  {
    id: 11,
    name: "Full-Frame 4K Mirrorless Camera",
    image: "/images/camera.svg",
    description: "Professional mirrorless digital camera with 45MP full-frame sensor, in-body stabilization, and cinematic 4K 120fps recording.",
    price: 1399.99,
    category: "Cameras",
  },
  {
    id: 12,
    name: "3-in-1 Magnetic Fast Charging Hub",
    image: "/images/charger.svg",
    description: "All-in-one wireless magnetic charging dock for smartphone, smartwatch, and wireless earbuds with smart heat management.",
    price: 59.99,
    category: "Accessories",
  },
];

