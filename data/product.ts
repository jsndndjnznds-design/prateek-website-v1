import { Product } from "@/types";

export const product: Product = {
  id: "holo-pro-x1",
  slug: "hologram-fan-display",
  name: "HoloVista Pro X1",
  eyebrow: "3D holographic advertising fan",
  price: 64999,
  compareAtPrice: 89999,
  currency: "INR",
  stock: 17,
  rating: 4.8,
  reviewCount: 50,
  shortDescription:
    "A premium LED hologram fan display that turns products, menus, offers, and brand visuals into floating 3D motion content.",
  description:
    "HoloVista Pro X1 combines high-density RGB LED blades, Wi-Fi content upload, app scheduling, and an ultra-bright 72 cm viewing field for modern retail, events, hospitality, and showroom advertising.",
  images: [
    {
      src: "/images/hologram-fan-hero.svg",
      alt: "HoloVista Pro X1 hologram fan with floating 3D product visuals",
      title: "Studio hero",
    },
    {
      src: "/images/hologram-fan-front.svg",
      alt: "Front view of the HoloVista Pro X1 four-blade LED hologram fan",
      title: "Front detail",
    },
    {
      src: "/images/hologram-fan-side.svg",
      alt: "Side profile of the HoloVista Pro X1 with slim wall mount",
      title: "Slim profile",
    },
    {
      src: "/images/hologram-fan-kit.svg",
      alt: "HoloVista Pro X1 kit with remote, power adapter, stand, and wall mount",
      title: "Complete kit",
    },
    {
      src: "/images/hologram-fan-retail.svg",
      alt: "Hologram fan installed in a premium retail counter environment",
      title: "Retail use",
    },
    {
      src: "/images/hologram-fan-event.svg",
      alt: "Hologram fan display used at an event booth with floating brand visual",
      title: "Event use",
    },
  ],
  features: [
    "72 cm floating display field with four high-speed LED blades",
    "1600 x 960 perceived resolution for crisp motion graphics",
    "Wi-Fi and app upload with content scheduling",
    "Adjustable 0-2500 cd/m2 brightness for indoor venues",
    "8 GB onboard storage for campaigns, menus, and launch visuals",
    "Wall mount, stand mount, and tabletop installation options",
  ],
  specifications: [
    { label: "Display diameter", value: "72 cm" },
    { label: "Blade layout", value: "4 LED arms with safety edges" },
    { label: "Perceived resolution", value: "1600 x 960" },
    { label: "LED density", value: "960 RGB lamp beads" },
    { label: "Brightness", value: "0-2500 cd/m2 adjustable" },
    { label: "Storage", value: "8 GB built in" },
    { label: "Connectivity", value: "Wi-Fi, mobile app, browser upload" },
    { label: "Supported formats", value: "MP4, AVI, RMVB, GIF, JPG, PNG" },
    { label: "Power", value: "70 W" },
    { label: "Warranty", value: "12 months carry-in warranty" },
  ],
  included: [
    "HoloVista Pro X1 hologram fan",
    "Protective acrylic cover",
    "Wall mounting bracket",
    "Table stand",
    "Remote control",
    "Power adapter",
    "8 GB campaign starter pack",
  ],
  shipping: [
    "Free insured shipping on prepaid orders",
    "Ships from Mumbai warehouse in 24-48 hours",
    "Pan-India delivery in 3-7 business days",
    "White-glove installation available in major cities",
  ],
};

export function getProductBySlug(slug: string) {
  return product.slug === slug ? product : null;
}
