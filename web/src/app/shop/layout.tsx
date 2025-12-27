import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop — Shoply",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-6">
      {/* Header Shop */}
      <div
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
                   bg-white border border-[#eadcc8] rounded-2xl
                   px-6 py-4 shadow-md
                   transition-all duration-300
                   hover:-translate-y-[1px] hover:shadow-lg"
      >
        <h1 className="text-3xl font-bold text-[#6f4e37]">
          Thực đơn Highland
        </h1>

        <nav className="text-sm flex items-center text-[#6f4e37]">
          <Link
            className="hover:underline hover:text-[#5a3e2b] transition-colors"
            href="/"
          >
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            className="font-medium hover:underline hover:text-[#5a3e2b] transition-colors"
            href="/shop"
          >
            Shop
          </Link>
        </nav>
      </div>

      {/* Nội dung Shop */}
      <div
        className="bg-white border border-[#eadcc8] rounded-2xl
                   shadow-lg p-6
                   transition-all duration-300"
      >
        {children}
      </div>
    </section>
  );
}
