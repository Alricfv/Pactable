import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pactable | Get quick agreements",
  description: "Create and share simple agreements fast. Perfect for housemates agreeing to rent/responsibilities and students doing group projects, rent or quick deals.",
  keywords: [
    "agreement generator",
    "agreement freelancer",
    "PDF agreements",
    "simple contracts",
    "AI agreements"
  ],
  authors: [{
    name: "Alric"
  }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + " text-white "}>
        <Navbar />
        <div className="min-h-[80vh]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}