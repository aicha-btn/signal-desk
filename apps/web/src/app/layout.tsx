import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "SignalDesk | Customer feedback intelligence",
    template: "%s | SignalDesk",
  },
  description:
    "Turn scattered customer feedback into clear, shared product decisions.",
  openGraph: {
    title: "SignalDesk | Turn customer feedback into clear decisions",
    description:
      "Capture every signal, reveal what matters and close the loop from one shared feed.",
    type: "website",
    images: [
      {
        url: "/images/signals-into-decisions.png",
        width: 1536,
        height: 1024,
        alt: "SignalDesk turns scattered feedback into an ordered signal flow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SignalDesk | Customer feedback intelligence",
    description: "Stop collecting feedback. Start deciding with it.",
    images: ["/images/signals-into-decisions.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
