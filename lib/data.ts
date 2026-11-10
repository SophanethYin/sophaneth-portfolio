// Prefix for files in public/ — Next doesn't add basePath to <img>/<a> paths by itself.
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

// Typed under the name in the hero, in a loop. [muted lead, highlighted rest]
export const roles: [string, string][] = [
  ["Full‑stack ", "Software Engineer"],
  ["Web ", "Developer"],
  ["ERP ", "Systems Developer"],
  ["Back‑end ", "Developer"],
];

export const nav = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Portfolio" },
  { href: "#journey", label: "Experience" },
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
  taglines: [string, string][]; // typed in a loop: [muted lead, highlighted rest]
  cover?: string;
  summary: string;
  chips: string[];
  stackLine: string;
  facts: { k: string; v: string }[];
  /** **double asterisks** mark the bold phrases */
  overview: string;
  gallery: { src: string; caption: string }[];
  features: { title: string; points: string[] }[];
  role: string;
  builtWith: string[];
  learned: string;
};

const fb = `${base}/projects/flowbill`;

export const flowBill: Project = {
  number: "01",
  name: ["Flow", "Bill"],
  taglines: [
    ["Custom ", "ERP for Samai Distillery"],
    ["Sales, stock & ", "invoicing"],
    ["USD & Riel, ", "right to the cent"],
    ["Used daily on ", "laptops, tablets & TVs"],
  ],
  // A file in public/, prefixed with base so it also works on GitHub Pages. Swap for the real cover later.
  cover: `${base}/SamaiFlow.png`,
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
    { k: "Status", v: "In production" },
  ],
  overview:
    "A custom ERP that replaced manual spreadsheets with one system for **sales documents, inventory, receivables and reporting** — used daily on laptops, tablets and office TV displays.",
  gallery: [
    { src: `${fb}/sales_performace_dashboard.png`, caption: "Sales performance against target, in 9‑litre cases" },
    { src: `${fb}/worldmap_dashboard.png`, caption: "Export dashboard with country map" },
    { src: `${fb}/product_line_inventory.png`, caption: "Product line inventory" },
    { src: `${fb}/sales_invoice.png`, caption: "Posted invoice with VAT, Specific Tax and Public Lighting Tax" },
    { src: `${fb}/invoice-tax.jpg`, caption: "Tax invoice PDF, in Khmer and English, with USD and Riel totals" },
    { src: `${fb}/invoice-commercial.jpg`, caption: "Commercial invoice PDF" },
    { src: `${fb}/invoice-export.jpg`, caption: "Export invoice PDF" },
  ],
  features: [
    {
      title: "Sales document chain",
      points: [
        "Quotation → Delivery Note → Invoice → Credit Note → Receipt, with rules that keep the chain consistent",
        "Draft / Confirmed / Posted workflows that lock finalized documents",
        "Branded PDF output for every document type",
      ],
    },
    {
      title: "Accurate money & tax",
      points: [
        "Dual currency: USD primary, Riel secondary, using National Bank of Cambodia rates",
        "Hidden tax‑inclusive breakdowns (Public Lighting Tax, Specific Tax) and VAT",
        "Preview, stored total and printed invoice match to the cent — tested on 300 sample documents",
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
        "Export flow: Projection → Proforma → Export Invoice",
      ],
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
        "Role‑based permission matrix — sales teams see only their own customers and documents",
        "CSRF protection, origin checks, rate limiting and server‑side validation",
        "Soft delete with recoverable Trash, plus an activity log",
      ],
    },
  ],
  role: "Sole developer — requirements with the business owner, system and database design, frontend, backend, deployment and ongoing maintenance.",
  builtWith: [
    "React",
    "Vite",
    "Tailwind v4",
    "Recharts",
    "d3",
    "axios",
    "FastAPI",
    "SQLAlchemy 2.0",
    "Pydantic v2",
    "PostgreSQL",
    "Alembic",
    "Jinja2",
    "slowapi",
    "Nginx",
    "systemd",
    "pytest",
    "Vitest",
  ],
  learned:
    "Turning real business and tax rules into reliable software, designing financial calculations that never drift by a cent, and shipping safely to a system people use every day.",
};

export const schoolProjects: {
  image?: string;
  placeholder: string;
  bg: string;
  tag: string;
  title: string;
  desc: string;
}[] = [
  {
    placeholder: "Store screenshot",
    bg: "#FFE4DC",
    tag: "University project · Web",
    title: "\"Name\" — online store",
    desc: "E‑commerce site for selling shirts and other products: catalogue, cart and checkout. …",
  },
  {
    placeholder: "App screenshot",
    bg: "#E4E0FF",
    tag: "University project · Mobile",
    title: "\"Name\" — budget app",
    desc: "Mobile app to track income and expenses and set spending budgets. …",
  },
];

const work = { color: "#FF5E3A", halo: "rgba(255,94,58,.14)" };
const edu = { color: "#3B2BC4", halo: "rgba(59,43,196,.12)" };

export const journey: {
  kind: string;
  start: string;
  end: string;
  title: string;
  org: string;
  desc: string;
  tags?: string;
  color: string;
  halo: string;
}[] = [
  {
    kind: "Education · Current",
    start: "2026",
    end: "Present",
    title: "Master's degree in Computer Science",
    org: "Institute of Technology of Cambodia (ITC)",
    desc: "Currently studying alongside full-time work.",
    ...edu,
  },
  {
    kind: "Work · Full-time",
    start: "2023",
    end: "Present",
    title: "Full-stack Software Engineer",
    org: "Samai Distillery Co., Ltd. · Phnom Penh",
    desc: "Sole engineer on FlowBill, the company ERP: from requirements and database design to the API, UI, PDF documents and the server it runs on. Launched the export sales line in Oct 2026.",
    tags: "Sales  ·  Inventory  ·  Warehouse  ·  Purchasing  ·  Accounting  ·  HR & payroll  ·  Dashboards",
    ...work,
  },
  {
    kind: "Education",
    start: "2022",
    end: "2026",
    title: "Bachelor's degree in IT",
    org: "National University of Management (NUM)",
    desc: "Graduated with a GPA of 3.65.",
    ...edu,
  },
];
