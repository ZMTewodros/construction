import { ServicesContent } from "./ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Ethio Construction",
  description: "From the first brick to the final touch, we provide end-to-end construction solutions across Ethiopia.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
