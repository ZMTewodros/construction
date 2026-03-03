import About  from "@/components/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Ethio Construction",
  description: "Building Ethiopia's landmarks since 2008 with a vision for sustainable growth and engineering excellence.",
};

export default function AboutPage() {
  return <About />;
}
