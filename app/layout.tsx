import type { Metadata } from "next";
import "@fontsource/geist-sans/300.css";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@fontsource/geist-sans/800.css";
import "@fontsource/geist-mono/400.css";
import "@fontsource/geist-mono/700.css";
import "./globals.css";
import { AccessCodeProvider } from "@/components/AccessCodeProvider";
import { AccessCodeModal } from "@/components/AccessCodeModal";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ReportCraft AI — Executive Dashboard Builder",
  description:
    "AI-powered data storytelling for marketing teams. Upload CSV/Excel data and get executive dashboards with charts, KPIs, and written narratives in seconds.",
  openGraph: {
    title: "ReportCraft AI — Executive Dashboard Builder",
    description:
      "Upload data. Get an executive dashboard in seconds. AI-powered analytics for marketing teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><rect width=%2232%22 height=%2232%22 rx=%228%22 fill=%22%23635BFF%22/><text x=%2216%22 y=%2222%22 font-size=%2218%22 fill=%22white%22 text-anchor=%22middle%22 font-weight=%22700%22 font-family=%22sans-serif%22>R</text></svg>"
        />
      </head>
      <body>
        <AccessCodeProvider>
          <Navbar />
          <main>{children}</main>
          <AccessCodeModal />
        </AccessCodeProvider>
      </body>
    </html>
  );
}
