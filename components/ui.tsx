import Image from "next/image";

/** Outlined word: a thick stroke, then the same word on top in the background colour so only the outer edge shows. */
export function OutlineWord({ text, fill, stroke = 4 }: { text: string; fill: string; stroke?: number }) {
  return (
    <span className="relative inline-block pr-[.05em]">
      <span className="text-plum" style={{ WebkitTextStroke: `${stroke}px #7A3FD1` }}>
        {text}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0" style={{ color: fill }}>
        {text}
      </span>
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="text-[15px] italic text-iris">{children}</span>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="m-0 text-[clamp(36px,4.2vw,54px)] font-bold italic leading-[1.1] text-ink">{children}</h2>
  );
}

export function CoralButton({
  href,
  children,
  className = "",
  download,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: string;
}) {
  return (
    <a
      href={href}
      download={download}
      className={`inline-flex items-center gap-2.5 rounded bg-coral font-semibold italic text-white shadow-coral transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-white ${className}`}
    >
      {children}
    </a>
  );
}

/** A fake browser window wrapping a screenshot, or a placeholder when there's no image yet. */
export function BrowserShot({
  src,
  alt,
  placeholder,
  bg = "#E3E0F5",
  urlBar = false,
}: {
  src?: string;
  alt: string;
  placeholder: string;
  bg?: string;
  urlBar?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-2 bg-[#ECEAF8] px-4 py-3">
        <span className="size-2.5 rounded-full bg-white" />
        <span className="size-2.5 rounded-full bg-white" />
        <span className="size-2.5 rounded-full bg-white" />
        {urlBar && <span className="ml-3 h-4 max-w-[220px] flex-1 rounded-lg bg-white" />}
      </div>
      <div className="relative aspect-[16/10]" style={{ background: bg }}>
        {src ? (
          <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-left-top" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm italic text-faint">{placeholder}</div>
        )}
      </div>
    </>
  );
}
