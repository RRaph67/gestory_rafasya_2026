import React from "react";
import { Header } from "@/components/organisms/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 pt-20">
        {children}
      </div>
    </div>
  );
}
