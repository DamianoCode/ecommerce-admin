import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "CMS Auth",
  description: "CMS Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center h-full">{children}</div>
  );
}
