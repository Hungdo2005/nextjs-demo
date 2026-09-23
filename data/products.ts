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
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    description: "Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    price: 199.99,
  },
  {
    id: 2,
    name: "Mechanical Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    description: "Compact RGB mechanical keyboard featuring hot-swappable tactile switches and aluminum chassis.",
    price: 89.99,
  },
  {
    id: 3,
    name: "Ergonomic Precision Mouse",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    description: "Wireless ergonomic mouse with high-precision optical sensor and customizable macro buttons.",
    price: 49.99,
  },
  {
    id: 4,
    name: "Ultra-Wide 4K Gaming Monitor",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    description: "34-inch curved gaming display with 144Hz refresh rate and vibrant HDR color reproduction.",
    price: 499.99,
  },
  {
    id: 5,
    name: "Studio Recording Condenser Mic",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Professional USB condenser microphone perfect for streaming, podcasting, and voiceover work.",
    price: 79.99,
  },
  {
    id: 6,
    name: "Smart Fitness Activity Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "Water-resistant smartwatch with real-time heart rate tracking, GPS, and multi-sport workout modes.",
    price: 129.99,
  },
];
