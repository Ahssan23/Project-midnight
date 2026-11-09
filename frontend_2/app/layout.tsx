import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rental Management System",
  description: "Manage your showroom and rental cars.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
