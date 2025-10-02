import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo.config";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #000000, #1a1a1a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: "bold",
              background: "linear-gradient(to right, #ffffff, #a0a0a0)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 40,
              color: "#a0a0a0",
              maxWidth: "800px",
              textAlign: "center",
            }}
          >
            AI-Powered Learning Platform
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
