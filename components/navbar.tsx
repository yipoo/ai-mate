 "use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { UserButton } from "./auth/user-button";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">AI文案助手</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
}