import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://blog.skillforge.dev"),
  title: {
    default: "SkillForge Blog",
    template: "%s · SkillForge Blog",
  },
  description:
    "Practical, hands-on writing on React, Firebase, and modern web development from the SkillForge team.",
  openGraph: {
    siteName: "SkillForge Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
