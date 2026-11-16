import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sophaneth.";

// Link-preview card: the header's "SOPHANETH." wordmark, in the blueprint's paper, ink and red (globals.css).
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#efe9dc",
          color: "#1b3a8f",
          fontSize: 150,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Sophaneth<span style={{ color: "#bb3915" }}>.</span>
      </div>
    ),
    size,
  );
}
