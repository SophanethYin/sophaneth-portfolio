// Prefix for files in public/. Next doesn't add basePath to <img>/<a> paths by itself.
export const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const profile = {
  email: "phanethyin168@gmail.com",
  phone: "099989172",
  phoneLabel: "099 989 172",
  github: "https://github.com/SophanethYin",
  telegram: "https://t.me/MrYinSoPhaneth",
  // Drop the PDF into public/ with this name.
  cvUrl: `${base}/Yin-Sophaneth-CV.pdf`,
};

export const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const stats = [
  { n: "3+", label: "Years in production" },
  { n: "8", label: "ERP modules shipped" },
  { n: "10–20", label: "Daily users on FlowBill" },
  { n: "3.65", label: "GPA · NUM" },
];

export type Project = {
  number: string;
  name: [string, string]; // [solid, outlined] halves of the title
  tagline: string;
  url: string; // shown in the browser-frame bar
  cover?: string;
  summary: string;
  chips: string[];
  stackLine: string;
  facts: { k: string; v: string }[];
  /** **double asterisks** mark the bold phrases */
  overview: string;
  gallery: { src: string; caption: string }[];
  features: { title: string; points: string[]; flow?: string[] }[];
  role: string;
  builtWith: { front: string[]; back: string[]; ops: string[] };
  learned: string; // one-line takeaway shown above the lessons
  lessons: { title: string; points: string[] }[];
};

const fb = `${base}/projects/flowbill`;

export const flowBill: Project = {
  number: "01",
  name: ["Flow", "Bill"],
  tagline: "Custom ERP for Samai Distillery",
  url: "flowbill.samai.com",
  // A file in public/, prefixed with base so it also works on GitHub Pages.
  cover: `${base}/erp-cover.webp`,
  summary:
    "A custom ERP for a Cambodian rum distillery. It replaced manual spreadsheets with one system for sales documents, inventory, accounts receivable and management reporting, and the business uses it every day on laptops, tablets and office TV displays.",
  chips: [
    "Sales document chain",
    "USD / KHR & Cambodian tax",
    "Multi‑warehouse inventory",
    "Local & export lines",
    "Management dashboards",
    "Role‑based access",
  ],
  stackLine: "React · Vite · Tailwind · FastAPI · SQLAlchemy · PostgreSQL · Nginx",
  facts: [
    { k: "Client", v: "Samai Distillery" },
    { k: "Location", v: "Phnom Penh, Cambodia" },
    { k: "Role", v: "Sole developer" },
    { k: "Status", v: "In production · since 2023" },
  ],
  overview:
    "A custom ERP that replaced manual spreadsheets with one system for **sales documents, inventory, receivables and reporting**. It's used daily on laptops, tablets and office TV displays.",
  // Ordered the way the app's sidebar runs: dashboards, sales, inventory, settings.
  gallery: [
    { src: `${fb}/sales-performance-dashboard.webp`, caption: "Sales performance against target, in 9‑litre cases" },
    {
      src: `${fb}/sales-performance-table.webp`,
      caption: "The same report as a table, with seasonality and product, size and country splits",
    },
    { src: `${fb}/worldmap-dashboard.webp`, caption: "Export dashboard with country map" },
    { src: `${fb}/export-invoices.webp`, caption: "Export invoices with country, payment status and amount due" },
    { src: `${fb}/sales-invoice.webp`, caption: "Posted invoice with VAT, Specific Tax and Public Lighting Tax" },
    { src: `${fb}/invoice-tax.webp`, caption: "Tax invoice PDF, in Khmer and English, with USD and Riel totals" },
    { src: `${fb}/invoice-commercial.webp`, caption: "Commercial invoice PDF" },
    { src: `${fb}/invoice-export.webp`, caption: "Export invoice PDF" },
    { src: `${fb}/product-line-inventory.webp`, caption: "Product line inventory" },
    { src: `${fb}/company-profile.webp`, caption: "Company profile in Khmer and English, used on every printed document" },
    { src: `${fb}/my-profile.webp`, caption: "User profile with photo upload and password change" },
  ],
  features: [
    {
      title: "Sales document chain",
      points: [
        "Quotation, delivery note, invoice, credit note and receipt, linked by rules that keep the chain consistent",
        "Draft / Confirmed / Posted workflows that lock finalized documents",
        "Branded PDF output for every document type",
      ],
    },
    {
      title: "Accurate money & tax",
      points: [
        "Dual currency: USD primary, Riel secondary, using National Bank of Cambodia rates",
        "Hidden tax‑inclusive breakdowns (Public Lighting Tax, Specific Tax) and VAT",
        "Preview, stored total and printed invoice match to the cent, checked on 300 sample documents",
      ],
    },
    {
      title: "Inventory & stock",
      points: [
        "Multiple warehouses with transfers, adjustments, disposals, samples and consignment stock",
        "Gift sets that automatically break down into component bottles",
        "Full stock ledger, stock flow reports and monthly opening‑stock confirmation",
      ],
    },
    {
      title: "Two business lines",
      points: [
        "Separate Local and Export lines, each with its own customers, products, warehouses and documents",
        "Export flow goes from projection to proforma to export invoice",
      ],
      flow: ["Projection", "Proforma", "Export invoice"],
    },
    {
      title: "Management dashboards",
      points: [
        "Sales against targets, product performance, cash flow, finance and receivables",
        "Reported in 9‑litre cases, with on/off‑trade splits and an export country map",
      ],
    },
    {
      title: "Security & access",
      points: [
        "Role‑based permissions, so sales teams see only their own customers and documents",
        "CSRF protection, origin checks, rate limiting and server‑side validation",
        "Soft delete with recoverable Trash, plus an activity log",
      ],
    },
  ],
  role: "Sole developer. I work out requirements with the business owner, design the system and database, build the frontend and backend, deploy it and keep it running.",
  builtWith: {
    front: ["React", "Vite", "Tailwind v4", "Recharts", "d3", "axios"],
    back: ["FastAPI", "SQLAlchemy 2.0", "Pydantic v2", "PostgreSQL", "Alembic", "Jinja2", "slowapi"],
    ops: ["Nginx", "systemd", "pytest", "Vitest", "Playwright"],
  },
  learned: "Business and tax rules are easy to read and hard to code.",
  lessons: [
    {
      title: "Keep the money exact",
      points: [
        "The preview, the stored total and the printed invoice have to match to the cent. I checked them on 300 sample documents.",
      ],
    },
    {
      title: "Ship without stopping work",
      points: ["People use the system all day, so every update has to go out without breaking what they are doing."],
    },
  ],
};

const pl = `${base}/projects/pitchlab`;

export const pitchLab: Project = {
  number: "02",
  name: ["PITCH", "LAB"],
  tagline: "Football shop for Cambodia",
  url: "football-shop-liard.vercel.app",
  cover: `${pl}/cover.webp`,
  summary:
    "An online football shop for Cambodia, in English and Khmer. Shoppers can put a name and number on a shirt and pay by KHQR, card or cash on delivery. I built the shop and the staff admin, and wrote my own API for both.",
  chips: [
    "English & Khmer",
    "USD & riel",
    "KHQR, card & cash on delivery",
    "Name & number printing",
    "Staff admin with roles",
    "About 360 API tests",
  ],
  stackLine: "Next.js · React · TypeScript · Tailwind · Hono · Drizzle · PostgreSQL",
  facts: [
    { k: "Type", v: "E-commerce website" },
    { k: "Market", v: "Cambodia" },
    { k: "Role", v: "Sole developer" },
    { k: "Status", v: "Finished and live" },
  ],
  overview:
    "PITCHLAB is an online football shop for Cambodia. It has **a customer shop, a staff admin and its own API**, all in one TypeScript repository. The shop first ran on Medusa, and I replaced Medusa with my own API in eight steps.",
  gallery: [
    { src: `${pl}/cover.webp`, caption: "Category page, search results and a product page" },
    { src: `${pl}/home.webp`, caption: "Home page with the sliding banner and category tiles" },
    { src: `${pl}/home-browse.webp`, caption: "Shop by league or team, and the New arrivals row" },
    { src: `${pl}/search.webp`, caption: "Search results for a player, with his teams" },
    { src: `${pl}/product.webp`, caption: "Product page with kits, fits, sizes and name and number printing" },
    { src: `${pl}/bag.webp`, caption: "Bag drawer with the free-delivery progress bar" },
    { src: `${pl}/checkout.webp`, caption: "Checkout with contact details, delivery choices and the order summary" },
    { src: `${pl}/payment.webp`, caption: "Card payment through ABA PayWay" },
    { src: `${pl}/order.webp`, caption: "Order page with step-by-step tracking" },
    { src: `${pl}/sign-in.webp`, caption: "Sign in with a mobile number or email" },
    { src: `${pl}/admin-dashboard.webp`, caption: "Staff admin dashboard with profit, orders to pack and visitors per day" },
    { src: `${pl}/admin-order.webp`, caption: "An order in the admin, with the items to pack and the next step" },
    { src: `${pl}/admin-product.webp`, caption: "Product editor with pictures, English and Khmer text, prices and stock for each size" },
    { src: `${pl}/admin-homepage.webp`, caption: "Homepage banner editor with a preview of each slide" },
  ],
  features: [
    {
      title: "Browse and search",
      points: [
        "Pages for each category, league, team and collection",
        "Filters are kept in the URL, so a filtered page can be shared or bookmarked",
        "Search finds products, teams, players and leagues, and still works with a typo",
      ],
    },
    {
      title: "Shirt printing",
      points: [
        "Add a name of up to 12 letters, a number from 1 to 99 and a league patch",
        "Each one has its own price, set in the admin",
      ],
    },
    {
      title: "Bag and checkout",
      points: [
        "The server prices the bag every time it is read, so the browser never sends a price",
        "Pay by ABA KHQR, card or cash on delivery. The live site runs ABA in test mode, so trying the checkout moves no real money",
        "Placing an order is one locked database transaction, so two shoppers can't buy the last shirt",
      ],
    },
    {
      title: "Accounts",
      points: [
        "Sign in with a phone number or email, by password or one-time code, with optional 2-step sign-in",
        "The wishlist, bag, currency and language follow the account to any device",
        "Customers who connect Telegram are told when the order is packed, out for delivery and delivered",
      ],
    },
    {
      title: "Two languages, two currencies",
      points: [
        "Every page is in English and Khmer, and falls back to English when the Khmer text is missing",
        "Prices show in US dollars or riel, at a rate set in the admin",
      ],
    },
    {
      title: "Staff admin",
      points: [
        "14 sections, including orders, products, promo codes, expenses and a sales dashboard",
        "Made for phones first, with a sidebar on a desktop",
        "Roles decide what each person sees, and who can see cost and profit or change prices",
        "Every change is written to an activity log",
      ],
    },
    {
      title: "Security",
      points: [
        "Session tokens are random, stored only as a SHA-256 hash and kept in an httpOnly cookie that page scripts can't read",
        "Password tries, code sends and promo-code guesses are rate limited",
        "Staff permissions are checked in the API, and staff tokens never reach the browser",
      ],
    },
    {
      title: "Tests and speed",
      points: [
        "About 360 API tests, run against a real Postgres database",
        "A load test with 500 shoppers who pause between clicks ran 157 requests a second on my laptop. Of those, 95% finished within 16 ms and none failed",
      ],
    },
  ],
  role: "Sole developer. I designed the database, wrote the API, built the shop and the admin, and put all three online.",
  builtWith: {
    front: ["Next.js 15", "React 19", "TypeScript", "Tailwind v4", "next-intl", "TanStack Query", "Zustand", "Radix UI", "Motion"],
    back: ["Hono", "Drizzle ORM", "PostgreSQL 16", "Zod", "ABA PayWay", "Telegram Bot API"],
    ops: ["Vitest", "Turborepo", "Docker", "Vercel", "Render", "Supabase", "Cloudflare R2"],
  },
  learned: "The server has to decide every price and every stock count.",
  lessons: [
    {
      title: "Never take a price from the browser",
      points: [
        "The bag stores only what was picked. The API works out every price again each time the bag is read, so a changed price or an ended discount applies at once.",
      ],
    },
    {
      title: "Lock before you take stock",
      points: [
        "An order locks the bag and its variants in one transaction, and a database rule stops stock going below zero.",
      ],
    },
    {
      title: "Replace a platform in steps",
      points: [
        "The shop first ran on Medusa. I replaced it with my own API in eight steps, and now every part of the store is code I wrote.",
      ],
    },
  ],
};

export const journey: {
  kind: string;
  work?: boolean; // red marker and year; education is ink
  start: string;
  end: string;
  title: string;
  org: string;
  desc: string;
  tags?: string;
}[] = [
  {
    kind: "Education · Current",
    start: "2026",
    end: "Present",
    title: "Master's degree in Computer Science",
    org: "Institute of Technology of Cambodia (ITC)",
    desc: "Currently studying alongside full-time work.",
  },
  {
    kind: "Work · Full-time",
    start: "2023",
    end: "Present",
    title: "Full-stack Software Engineer",
    org: "Samai Distillery Co., Ltd. · Phnom Penh",
    desc: "Sole engineer on FlowBill, the company ERP: from requirements and database design to the API, UI, PDF documents and the server it runs on. Launched the export sales line in Oct 2026.",
    tags: "Sales  ·  Inventory  ·  Warehouse  ·  Purchasing  ·  Accounting  ·  HR & payroll  ·  Dashboards",
    work: true,
  },
  {
    kind: "Education",
    start: "2022",
    end: "2026",
    title: "Bachelor's degree in IT",
    org: "National University of Management (NUM)",
    desc: "Graduated with a GPA of 3.65.",
  },
];

// ---- Toolkit (the Skills orbit) ------------------------------------------------
// Add a tool here and the orbit lays itself out: each category is one ring, the biggest ring outermost.
// `logo` is a file in public/logos/ (without .svg); leave it out and the chip shows a two-letter monogram.

export type ToolCategory = "front" | "back" | "ops";

export const toolCategories: Record<ToolCategory, string> = {
  front: "Front-end",
  back: "Back-end & data",
  ops: "Ops & documents",
};

export const tools: { name: string; category: ToolCategory; logo?: string; mono?: string }[] = [
  { name: "React", category: "front", logo: "react" },
  { name: "Next.js", category: "front", logo: "nextjs" },
  { name: "TypeScript", category: "front", logo: "typescript" },
  { name: "JavaScript", category: "front", logo: "javascript" },
  { name: "Tailwind CSS", category: "front", logo: "tailwindcss" },
  { name: "TanStack Query", category: "front", logo: "tanstackquery" },
  { name: "Bootstrap", category: "front", logo: "bootstrap" },
  { name: "Vite", category: "front", logo: "vite" },
  { name: "Python", category: "back", logo: "python" },
  { name: "FastAPI", category: "back", logo: "fastapi" },
  { name: "PostgreSQL", category: "back", logo: "postgresql" },
  { name: "SQLAlchemy", category: "back", logo: "sqlalchemy" },
  { name: "Drizzle ORM", category: "back", logo: "drizzle" },
  { name: "Zod", category: "back", logo: "zod" },
  { name: "Stripe", category: "back", logo: "stripe" },
  { name: "Java", category: "back", logo: "java" },
  { name: "Ubuntu", category: "ops", logo: "ubuntu" },
  { name: "Nginx", category: "ops", logo: "nginx" },
  { name: "systemd", category: "ops", mono: "SD" }, // no Simple Icons glyph
  { name: "Playwright PDFs", category: "ops", mono: "PW" }, // no Simple Icons glyph
  { name: "Vitest", category: "ops", logo: "vitest" },
  { name: "pytest", category: "ops", logo: "pytest" },
];
