import { Inter, Courier_Prime } from "next/font/google";

// /faith uses the canonical type set: Fraunces (headings, loaded site-wide in the root layout),
// Inter (body) and Courier Prime (kickers, dates, labels). Scoped to this section only.
const inter = Inter({ variable: "--font-faith-body", subsets: ["latin"], display: "swap" });
const courier = Courier_Prime({
  variable: "--font-faith-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function FaithLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${courier.variable} faith-section`}>{children}</div>;
}
