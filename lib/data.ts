export const profile = {
  email: "phanethyin19@gmail.com",
  phone: "099989172",
  phoneLabel: "099 989 172",
  github: "https://github.com/SophanethYin",
  // Drop the PDF into public/ with this name.
  cvUrl: "/Yin-Sophaneth-CV.pdf",
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
  { href: "#contact", label: "Contact" },
];

export const services = [
  {
    icon: "</>",
    title: "Front‑end",
    desc: "Fast, clear interfaces for people who use them all day.",
    tools: "React · Next.js · Tailwind · Bootstrap",
    iconBg: "linear-gradient(135deg,#6A4BFF,#3B2BC4)",
    titleClass: "text-coral",
    offset: "md:-rotate-[1.5deg]",
    highlight: true,
  },
  {
    icon: "API",
    title: "Back‑end",
    desc: "APIs, databases and documents that stay correct.",
    tools: "Python · FastAPI · PostgreSQL · Java",
    iconBg: "linear-gradient(135deg,#FF8A5E,#FF5E3A)",
    titleClass: "text-iris-deep",
    offset: "md:translate-x-[14px]",
    highlight: false,
  },
  {
    icon: "ERP",
    title: "Business systems",
    desc: "ERP and POS that run sales, stock and accounting.",
    tools: "Ubuntu · Nginx · Playwright PDFs",
    iconBg: "linear-gradient(135deg,#B04EC9,#6A4BFF)",
    titleClass: "text-iris-deep",
    offset: "md:translate-x-[28px]",
    highlight: false,
  },
];

export const stats = [
  { n: "3+", label: "Years in production" },
  { n: "8", label: "ERP modules shipped" },
  { n: "10–20", label: "Daily users on Samai Flow" },
  { n: "3.65", label: "GPA · NUM" },
];

export const samaiFlow = {
  // Set to a path in public/, e.g. "/samai-flow.png", once you have a screenshot.
  image: "/SamaiFlow.png" as string | undefined,
  modules: [
    "Inventory",
    "Production & batches",
    "Sales & orders",
    "Purchasing",
    "Accounting",
    "HR & payroll",
    "Warehouse",
    "Reports & dashboards",
  ],
  stack: "FastAPI · SQLAlchemy · PostgreSQL · React · Vite · Tailwind · Playwright · Nginx",
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
    desc: "Sole engineer on Samai Flow, the company ERP: from requirements and database design to the API, UI, PDF documents and the server it runs on. Launched the export sales line in Oct 2026.",
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

export const skillGroups = [
  {
    n: "01",
    title: "Front‑end",
    grad: "linear-gradient(90deg,#FF5E3A,#FF8A5E)",
    items: [
      { name: "React", note: "Samai Flow UI" },
      { name: "Next.js", note: "Web apps" },
      { name: "JavaScript", note: "Daily" },
      { name: "Tailwind CSS", note: "Styling" },
      { name: "Bootstrap", note: "School projects" },
      { name: "Vite", note: "Build tooling" },
    ],
  },
  {
    n: "02",
    title: "Back‑end & data",
    grad: "linear-gradient(90deg,#3B2BC4,#7A3FD1)",
    items: [
      { name: "Python", note: "Daily" },
      { name: "FastAPI", note: "ERP API" },
      { name: "SQLAlchemy", note: "ORM" },
      { name: "PostgreSQL", note: "Production DB" },
      { name: "Java", note: "University" },
      { name: "Stripe", note: "Payments" },
    ],
  },
  {
    n: "03",
    title: "Ops & documents",
    grad: "linear-gradient(90deg,#7A3FD1,#B04EC9)",
    items: [
      { name: "Ubuntu", note: "Server" },
      { name: "Nginx", note: "Reverse proxy" },
      { name: "Jinja2", note: "PDF templates" },
      { name: "Playwright", note: "PDF rendering" },
    ],
  },
];

export const marqueeWords = ["React", "FastAPI", "PostgreSQL", "Next.js", "Python", "Tailwind", "Nginx", "Java"];

export const topics = ["ERP system", "POS", "Website", "Other"];

export const channels = [
  { k: "Email", v: profile.email, href: `mailto:${profile.email}`, arrow: "↗" },
  { k: "Telegram", v: profile.phoneLabel, href: `tel:${profile.phone}`, arrow: "↗" },
  { k: "GitHub", v: "SophanethYin", href: profile.github, arrow: "↗" },
  { k: "Based in", v: "Phnom Penh, Cambodia", href: "#contact", arrow: "" },
];
