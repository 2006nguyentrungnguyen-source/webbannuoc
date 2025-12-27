"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CartIndicator from "@/components/CartIndicator";
import { cn } from "@/app/lib/cn";

const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/admin", label: "Admin" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-3 z-50">
      <div className="mx-auto max-w-6xl px-3">
        <div
          className="
            h-16 flex items-center gap-3 px-4
            rounded-2xl
            bg-[#FFF7ED]/90 backdrop-blur
            border border-[#7B1E1E]/20
            shadow-lg
          "
        >
          {/* ===== BRAND TEXT ===== */}
          <Link
            href="/"
            className="
              font-extrabold tracking-widest text-lg
              text-[#7B1E1E]
              hover:opacity-80
              transition
            "
          >
            HIGHLANDS
          </Link>

          {/* ===== SEARCH ===== */}
         
          {/* ===== NAV ===== */}
          <nav className="ml-auto flex items-center gap-1 rounded-full bg-[#7B1E1E]/10 p-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95",
                    isActive
                      ? "bg-[#7B1E1E] text-[#FFF7ED] shadow"
                      : "text-[#7B1E1E] hover:bg-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* ===== CART ===== */}
            <div className="px-2">
              <CartIndicator />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
