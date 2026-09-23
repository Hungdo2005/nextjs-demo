export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    image: "/images/headphones.svg",
    description: "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    price: 199.99,
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    image: "/images/keyboard.svg",
    description: "Compact RGB mechanical keyboard featuring hot-swappable tactile switches and aluminum chassis.",
    price: 89.99,
  },
  {
    id: 3,
    name: "Ergonomic Precision Mouse",
    image: "/images/mouse.svg",
    description: "Wireless ergonomic mouse with high-precision optical sensor and customizable macro buttons.",
    price: 49.99,
  },
  {
    id: 4,
    name: "Ultra-Wide 4K Gaming Monitor",
    image: "/images/monitor.svg",
    description: "34-inch curved gaming display with 144Hz refresh rate and vibrant HDR color reproduction.",
    price: 499.99,
  },
  {
    id: 5,
    name: "Studio Recording Condenser Mic",
    image: "/images/microphone.svg",
    description: "Professional USB condenser microphone perfect for streaming, podcasting, and voiceover work.",
    price: 79.99,
  },
  {
    id: 6,
    name: "Smart Fitness Activity Watch",
    image: "/images/smartwatch.svg",
    description: "Water-resistant smartwatch with real-time heart rate tracking, GPS, and multi-sport workout modes.",
    price: 129.99,
  },
];
