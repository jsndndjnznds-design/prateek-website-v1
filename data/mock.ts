import { AnalyticsPoint, Customer, Order, RecentPurchase, Review } from "@/types";

const names = [
  "Aarav Mehta",
  "Priya Nair",
  "Rahul Kapoor",
  "Anika Shah",
  "Kabir Sinha",
  "Meera Rao",
  "Arjun Bansal",
  "Isha Menon",
  "Dev Malhotra",
  "Nisha Iyer",
  "Rohan Khanna",
  "Tara Bose",
  "Vivaan Reddy",
  "Sana Qureshi",
  "Aditya Pillai",
  "Kavya Jain",
  "Neel Verma",
  "Maya Dutta",
  "Karan Gill",
  "Riya Chawla",
  "Yash Agarwal",
  "Leela Thomas",
  "Omkar Joshi",
  "Zara Sheikh",
  "Manav Kulkarni",
];

const cities = [
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Kochi",
];

const companies = [
  "Nova Retail Labs",
  "Bluefin Events",
  "Urban Bite Co.",
  "MetroMall Media",
  "PixelCraft Studios",
  "Aurum Jewels",
  "Fuse Fitness",
  "Studio Vanta",
  "CloudNine Cafes",
  "Launchbay Expo",
];

const reviewTitles = [
  "Pulled people into the booth instantly",
  "Premium finish and surprisingly easy setup",
  "Our menu promos finally get noticed",
  "Looks expensive in the best way",
  "The app workflow is simple for store teams",
  "A proper conversation starter",
  "Clear visuals even under showroom lighting",
  "Worth it for launches and weekend offers",
  "Customers stop, record, and share",
  "Reliable after weeks of daily use",
];

const reviewBodies = [
  "We installed it near the entrance and saw more people pause before entering. The floating visuals look much sharper than the old TV loop we used.",
  "The hardware feels solid, the acrylic cover is clean, and our team learned the content upload flow in one afternoon.",
  "Short product animations look fantastic. Brightness control helped us dial it down for evening ambience without losing the 3D effect.",
  "I was worried it would feel gimmicky, but it actually makes the counter look premium. Great for high-margin launches.",
  "We use it for daily offers and event announcements. The scheduling flow keeps our staff from manually changing files every morning.",
  "It became the most photographed part of our activation booth. People kept asking where the hologram was coming from.",
  "The fan is quiet enough for our retail floor and the motion graphics remain visible from different angles.",
  "Setup was smoother than expected. The included stand helped us test placement before wall mounting it.",
  "Our product renders look like they are floating above the shelf. It gives a modern showroom feel without a massive display wall.",
  "Packaging, remote, mount, and support were all professional. It feels ready for customer-facing environments.",
];

const roles = [
  "Retail owner",
  "Marketing manager",
  "Cafe founder",
  "Event producer",
  "Showroom director",
];

export const customers: Customer[] = names.map((name, index) => ({
  id: `CUS-${(index + 1).toString().padStart(3, "0")}`,
  name,
  email: `${name.toLowerCase().replace(/\s/g, ".")}@example.com`,
  company: companies[index % companies.length],
  location: cities[index % cities.length],
  totalSpent: 64999 + (index % 6) * 24000,
  joinedAt: `2026-${String(1 + (index % 5)).padStart(2, "0")}-${String(4 + index).padStart(2, "0")}`,
  status: index % 7 === 0 ? "VIP" : index % 3 === 0 ? "Returning" : "New",
}));

export const reviews: Review[] = Array.from({ length: 50 }, (_, index) => ({
  id: `REV-${(index + 1).toString().padStart(3, "0")}`,
  customerName: names[index % names.length],
  role: roles[index % roles.length],
  location: cities[index % cities.length],
  rating: index % 9 === 0 ? 4 : 5,
  title: reviewTitles[index % reviewTitles.length],
  body: reviewBodies[(index * 3) % reviewBodies.length],
  date: `2026-${String(2 + (index % 4)).padStart(2, "0")}-${String(1 + (index % 27)).padStart(2, "0")}`,
  verified: index % 8 !== 0,
  useCase: ["Retail", "Events", "Hospitality", "Showroom", "Mall kiosk"][index % 5],
  helpful: 8 + ((index * 7) % 64),
}));

const statuses: Order["status"][] = ["Paid", "Processing", "Packed", "Shipped", "Delivered"];
const channels: Order["channel"][] = ["Online Store", "Sales Call", "Partner"];

export const orders: Order[] = Array.from({ length: 100 }, (_, index) => {
  const customer = customers[index % customers.length];
  const quantity = 1 + (index % 3 === 0 ? 1 : 0);
  const addon = index % 5 === 0 ? 6990 : index % 4 === 0 ? 3490 : 0;

  return {
    id: `HVX-${(10420 + index).toString()}`,
    customer: customer.name,
    email: customer.email,
    amount: quantity * 64999 + addon,
    status: statuses[index % statuses.length],
    date: `2026-${String(1 + (index % 6)).padStart(2, "0")}-${String(1 + (index % 28)).padStart(2, "0")}`,
    items: quantity,
    channel: channels[index % channels.length],
  };
});

export const analyticsData: AnalyticsPoint[] = [
  { label: "Jan", orders: 12, revenue: 779988, visitors: 4200, conversion: 2.8 },
  { label: "Feb", orders: 16, revenue: 1039984, visitors: 5100, conversion: 3.1 },
  { label: "Mar", orders: 19, revenue: 1234981, visitors: 5900, conversion: 3.2 },
  { label: "Apr", orders: 24, revenue: 1559976, visitors: 6800, conversion: 3.5 },
  { label: "May", orders: 31, revenue: 2014969, visitors: 7600, conversion: 4.1 },
  { label: "Jun", orders: 37, revenue: 2404963, visitors: 8500, conversion: 4.3 },
  { label: "Jul", orders: 42, revenue: 2729958, visitors: 9300, conversion: 4.5 },
  { label: "Aug", orders: 48, revenue: 3119952, visitors: 10200, conversion: 4.7 },
  { label: "Sep", orders: 52, revenue: 3379948, visitors: 11200, conversion: 4.6 },
  { label: "Oct", orders: 61, revenue: 3964939, visitors: 12600, conversion: 4.8 },
  { label: "Nov", orders: 68, revenue: 4419932, visitors: 13900, conversion: 4.9 },
  { label: "Dec", orders: 74, revenue: 4804926, visitors: 15100, conversion: 4.9 },
];

export const recentPurchases: RecentPurchase[] = [
  { name: "Aurum Jewels", city: "Mumbai", minutesAgo: 4 },
  { name: "Urban Bite Co.", city: "Bengaluru", minutesAgo: 11 },
  { name: "Launchbay Expo", city: "Delhi", minutesAgo: 18 },
  { name: "CloudNine Cafes", city: "Pune", minutesAgo: 27 },
  { name: "Fuse Fitness", city: "Hyderabad", minutesAgo: 39 },
];
