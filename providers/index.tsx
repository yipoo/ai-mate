"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "./user-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
} 