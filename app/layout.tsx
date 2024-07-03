import "./globals.css";
import Support from "./Support";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'CodeYard',
  description: "CodeYard is a unique dating app for coders. Connect with fellow developers, make friends, and turn them into coding dates. Whether you're looking to collaborate on projects or just want to meet like-minded individuals, CodeYard is the place for you.",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Support children={children} />
  );
}
