import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "YS logo and Sophaneth.";

// Link-preview card (Telegram, WhatsApp, etc.): the YS logo beside the header's "SOPHANETH." wordmark,
// in the blueprint's paper, ink and red (globals.css).
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo.svg"));
  // The header's Barlow Condensed Bold, fetched as TTF (the image renderer can't read woff2); build already needs network for next/font.
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&text=SOPHANETH.")).text();
  const font = await (await fetch(css.match(/src: url\((.+?)\)/)![1])).arrayBuffer();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          background: "#efe9dc",
          color: "#1b3a8f",
          fontFamily: "Barlow Condensed",
          fontSize: 130,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} width={380} height={380} alt="" />
        <div style={{ display: "flex" }}>
          Sophaneth<span style={{ color: "#bb3915" }}>.</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Barlow Condensed", data: font, weight: 700 }] },
  );
}
