import type { Metadata } from "next";

import { Providers } from "./providers";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AdminHub — Admin Dashboard",
    template: "%s · AdminHub",
  },
  description:
    "Responsive admin dashboard for users, transactions and bookings — built with Next.js, TanStack Query and Redux Toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
