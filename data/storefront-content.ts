export const storefrontContent = {
  store: {
    name: "HoloVista",
    descriptor: "Holographic display systems",
    footerDescription: "Browse the current HoloVista catalog. Product listings show the details, price, and availability provided for each item.",
  },
  hero: {
    eyebrow: "HoloVista store",
    title: "Holographic display products",
    description: "",
    primaryAction: "Shop all",
    secondaryAction: "",
  },
  support: {
    eyebrow: "Shopping with HoloVista",
    title: "A straightforward way to shop the catalog.",
    description: "Review the product information, save items for later, and submit an order request when ready.",
    steps: [
      {
        title: "Review products",
        description: "Open any product to review its images, description, price, and availability.",
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
  contact: {
    title: "Contact HoloVista",
    description: "Add the store's verified customer contact information here before publishing the storefront.",
    email: "",
    phone: "",
    location: "",
  },
  legal: {
    publicationNotice:
      "This is an editable policy placeholder. The store owner must add the real business, contact, shipping, and legal information before publishing this page.",
  },
} as const;
