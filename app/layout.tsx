import { ThemeModeScript } from "flowbite-react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "../.flowbite-react/init";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://lilromepraba.com"; // 🔁 Replace with your actual domain

export const viewport: Viewport = {
  themeColor: "#DC143C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "LIL ROME PRABA — Sri Lanka's Hardest Rapper | Official Site",
    template: "%s | LIL ROME PRABA",
  },
  description:
    "Official website of Lil Rome Praba — Sri Lanka's boundary-pushing rapper from Negombo. Hip-hop, melodic rap, and street rap fused with global influences. Stream new music, book shows, and follow the journey.",

  keywords: [
    // ── Artist identity
    "Lil Rome Praba",
    "Lil Rome Praba official",
    "PRABA rapper",
    "PRABA Sri Lanka",
    "Lil Rome Praba music",
    "Lil Rome Praba songs",
    "Lil Rome Praba rapper",
    "Lil Rome Praba new song",
    "Lil Rome Praba album",
    "Lil Rome Praba Negombo",
    "Dushan Prabashana",

    // ── Song titles
    "Na Hook",
    "Na Hook feat Costa Marley",
    "Kachal Kasi",
    "Kachal Kasi Smokio",
    "Bashawa",
    "Gaanu Nakatha",
    "ගෑනු නැකත",
    "Theruyi Kal Yayi",
    "තේරෙයි කල් යයි",
    "Paramanu",
    "පරමාණු",
    "Made His Dis",
    "මදේ හිස් ඩිස්",
    "Visakuru Charitha",
    "Dewathwen",
    "දේවත්වෙන්",
    "Fake Chandi",
    "Mama Mama Maai",
    "Dahama",
    "දහම",
    "Yakkunge Vimane",
    "Ahasa Gugura",

    // ── Featured artists
    "Costa rapper Sri Lanka",
    "Marley rapper Sri Lanka",
    "Smokio rapper",
    "Lil Rome Asha",
    "SHAGI rapper",
    "Safa rapper Sri Lanka",

    // ── Genre / sound
    "Sri Lanka hip hop",
    "Sri Lankan rapper",
    "Sri Lanka rap music",
    "Sinhala rap",
    "Sinhala hip hop",
    "melodic rap Sri Lanka",
    "street rap Sri Lanka",
    "genre bending rap",
    "trap music Sri Lanka",
    "rap music Negombo",
    "underground rap Sri Lanka",
    "new wave rap Sri Lanka",
    "Sinhala trap",
    "Sri Lanka drill",
    "South Asian rap",
    "Asian hip hop artist",

    // ── Location signals
    "Negombo rapper",
    "Negombo hip hop",
    "Western Province rapper Sri Lanka",
    "Sri Lanka music artist",
    "Sri Lankan music 2025",
    "Sri Lankan music 2026",

    // ── Intent / action keywords
    "book Sri Lankan rapper",
    "hire rapper Sri Lanka",
    "Sri Lanka rapper booking",
    "Sri Lankan rapper for events",
    "Sri Lanka live rap performance",
    "Sri Lankan rapper features",
    "rap collaboration Sri Lanka",
    "rap press inquiry Sri Lanka",

    // ── Discovery / streaming
    "Lil Rome Praba Spotify",
    "Lil Rome Praba YouTube",
    "Lil Rome Praba TikTok",
    "Lil Rome Praba Instagram",
    "stream Sri Lanka rap",
    "new Sri Lankan music",
    "best Sri Lankan rapper",
    "top rapper Sri Lanka",
    "rising rapper Sri Lanka",
    "Sri Lanka rap 2026",
    "Sinhala music 2026",
  ],

  authors: [{ name: "Lil Rome Praba", url: BASE_URL }],
  creator: "Lil Rome Praba",
  publisher: "Lil Rome Praba Official",

  category: "music",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "LIL ROME PRABA Official",
    title: "LIL ROME PRABA — Sri Lanka's Hardest Rapper",
    description:
      "Born and raised in Negombo, Sri Lanka. Hip-hop, melodic rap, street rap. Stream music, book shows, and follow the journey of Lil Rome Praba.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LIL ROME PRABA — Official",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LIL ROME PRABA — Sri Lanka's Hardest Rapper",
    description:
      "Official site of Lil Rome Praba. Hip-hop, melodic rap & street rap from Negombo, Sri Lanka. Personal. Powerful. Unapologetic.",
    images: ["/og-image.jpg"],
    creator: "@lilromepraba",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  manifest: "/manifest.json",

  alternates: {
    canonical: BASE_URL,
  },

  verification: {
    // google: "your-google-site-verification-token", // Uncomment and add when you verify Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}