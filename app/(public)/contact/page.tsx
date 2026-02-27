import { ContactContent } from "./ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Request a Quote | Ethio Construction",
  description: "Ready to build? Tell us about your project and let's create something extraordinary together.",
};

export default function ContactPage() {
  return <ContactContent />;
}
