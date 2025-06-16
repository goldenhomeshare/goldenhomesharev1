import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "View Housemates | Golden HomeShare",
    description: "Browse verified housemates looking for shared living arrangements. Find compatible housemates based on lifestyle, preferences, and support needs.",
  };
}

export const metadata: Metadata = {
  title: "View Housemates | Golden HomeShare",
  description: "Browse verified housemates looking for shared living arrangements. Find compatible housemates based on lifestyle, preferences, and support needs.",
}; 