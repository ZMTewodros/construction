import  Projects  from "../../../components/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Portfolio | Ethio Construction",
  description: "A showcase of our commitment to quality and architectural excellence across Ethiopia.",
};

export default function ProjectsPage() {
  return <Projects />;
}
