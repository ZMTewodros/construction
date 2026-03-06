import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Ethio Construction | Building Ethiopia's Future",
  description: "Professional construction services in Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning={true} prevents errors caused by 
          browser extensions injecting attributes into the body tag.
      */}
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}