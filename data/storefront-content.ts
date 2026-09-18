export const storefrontContent = {
  hero: {
    eyebrow: "HoloVista catalog",
    title: "Holographic displays built for spaces that need to stand out.",
    description:
      "Explore professional display systems for retail, events, hospitality, and showrooms. Every product page shows its current price and availability.",
    primaryAction: "Browse products",
  },
  support: {
    eyebrow: "Shopping with HoloVista",
    title: "Choose the setup that fits your space.",
    description: "Build an order from the live catalog, then review every item and quantity before checkout.",
    steps: [
      {
        title: "Compare products",
        description: "Open a product to review its images, description, price, and availability.",
      },
      {
        title: "Build your cart",
        description: "Add one or several products, then adjust quantities from your cart.",
      },
      {
        title: "Review at checkout",
        description: "Checkout confirms the current catalog items, quantities, and total before an order is saved.",
      },
    ],
  },
} as const;
