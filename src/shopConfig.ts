// ==========================================
// UA TEXTILES - SHOP & INVENTORY CONTROL FILE
// Edit only this file to update your website!
// ==========================================

import heroTextilesImg from "./assets/images/hero_kano_textiles_1794652409555.jpg";
import shaddaWagambariImg from "./assets/images/shadda_wagambari_1794652409282.jpg";
import atampaSuperwaxImg from "./assets/images/atampa_superwax_1794652410293.jpg";
import swissVoileLaceImg from "./assets/images/swiss_voile_lace_1794652409642.jpg";
import cashmereSenatorImg from "./assets/images/cashmere_senator_1794652410307.jpg";
import polishShaddaBundleImg from "./assets/images/polish_shadda_bundle_1794652410806.jpg";

export interface ShopConfig {
  name: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
  hours: string;
  notice: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  badge: string;
  colors: string;
  description: string;
  image: string;
  swatchColor: string;
  inStock: boolean;
}

export const HERO_IMAGE = heroTextilesImg;

export const SHOP_CONFIG: ShopConfig = {
  name: "UA Textiles",
  tagline: "Quality Wholesale & Retail Fabrics — Kantin Kwari Market, Kano",
  address: "Shop 12, Block B, Kantin Kwari Market, Kano State, Nigeria", // Update with your exact shop address
  whatsappNumber: "2348000000000", // Format: 234 + number without the first 0 (e.g., 2348031234567)
  hours: "Mon – Sat: 8:00 AM – 6:00 PM",
  notice: "Nationwide waybill delivery available from Kano to Abuja, Lagos, Kaduna & all states."
};

// Add, edit, or remove fabrics below
export const PRODUCTS: ProductItem[] = [
  {
    id: "shadda-01",
    name: "Royal Wagambari Shadda (Getzner Grade)",
    category: "Shadda / Bazin",
    price: 45000,
    unit: "Per 5 Yards",
    badge: "Best Seller",
    colors: "White, Sky Blue, Navy, Cream",
    description: "Crisp, glossy Austrian-style guinea brocade. Ideal for Babban Riga & Kaftan.",
    image: shaddaWagambariImg, // Put photo in images/ folder or import above, or leave "" to use swatchColor
    swatchColor: "#1e3a5f",
    inStock: true
  },
  {
    id: "atampa-01",
    name: "Super Wax Atampa (6 Yards)",
    category: "Atampa / Ankara",
    price: 18500,
    unit: "Per 6 Yards",
    badge: "New Arrival",
    colors: "Emerald & Gold, Wine & Cream",
    description: "100% cotton fast-color wax print. Soft texture that does not fade.",
    image: atampaSuperwaxImg,
    swatchColor: "#0f5132",
    inStock: true
  },
  {
    id: "lace-01",
    name: "Swiss Voile Lace with Stonework",
    category: "Lace & Voile",
    price: 65000,
    unit: "Per 5 Yards",
    badge: "Wholesale Available",
    colors: "Champagne Gold, Peach, Onion",
    description: "Premium embroidered voile lace suitable for weddings and special occasions.",
    image: swissVoileLaceImg,
    swatchColor: "#8c5a32",
    inStock: true
  },
  {
    id: "senator-01",
    name: "Italian Cashmere Senator Material",
    category: "Cashmere & Senator",
    price: 22000,
    unit: "Per 4 Yards",
    badge: "",
    colors: "Charcoal Grey, Black, Coffee Brown",
    description: "Heavyweight, wrinkle-resistant cashmere wool blend for sharp tailoring.",
    image: cashmereSenatorImg,
    swatchColor: "#334155",
    inStock: true
  },
  {
    id: "shadda-02",
    name: "Classic Polish Shadda (Wholesale Bundle)",
    category: "Shadda / Bazin",
    price: 320000,
    unit: "Per Bale / 10 Pieces",
    badge: "Wholesale",
    colors: "Assorted Colors",
    description: "Factory-packed wholesale bundle for retailers and market resellers.",
    image: polishShaddaBundleImg,
    swatchColor: "#4a1d6e",
    inStock: true
  }
];
