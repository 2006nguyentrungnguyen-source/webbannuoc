"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  // Lấy từ khóa từ URL (hỗ trợ cả 'q' và 'search' từ trang chủ truyền sang)
  const qParam = searchParams.get("q") || searchParams.get("search") || "";

  const [qInput, setQInput] = useState(qParam);

  // Cập nhật ô input khi URL thay đổi (ví dụ từ trang chủ nhảy sang)
  useEffect(() => {
    setQInput(qParam);
  }, [qParam]);

  const queryArgs = useMemo(
    () => ({ page: pageParam, limit: LIMIT, q: qParam || undefined }),
    [pageParam, qParam]
  );

  const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

  // Hàm cập nhật URL
  function setUrl(next: { page?: number; q?: string }) {
    const sp = new URLSearchParams(searchParams.toString());
    
    if (typeof next.page === "number") {
      sp.set("page", String(next.page));
    } else if (next.q !== undefined) {
      // Khi tìm kiếm mới, reset về trang 1
      sp.set("page", "1");
      if (next.q) sp.set("q", next.q);
      else sp.delete("q");
      sp.delete("search"); // Xóa param 'search' cũ nếu có
    }
    
    router.push(`${pathname}?${sp.toString()}`);
  }

  // Xử lý khi nhấn Enter hoặc nút Tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrl({ q: qInput.trim() });
  };

  return (
    <main className="py-10">
      {/* ===== HEADER & SEARCH BAR ===== */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#7B1E1E] tracking-wide">
            MENU HIGHLANDS
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Thưởng thức cà phê & đồ uống đặc trưng
          </p>
          <div className="mt-3 h-[3px] w-20 bg-[#7B1E1E] rounded-full" />
        </div>

        {/* THANH TÌM KIẾM TẠI TRANG SHOP */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="w-full pl-4 pr-12 py-2.5 rounded-xl border-2 border-[#7B1E1E]/10 focus:border-[#7B1E1E] focus:outline-none transition-all bg-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#7B1E1E] text-white rounded-lg hover:bg-[#631818] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>
      </div>

      {/* ===== HIỂN THỊ TRẠNG THÁI TÌM KIẾM ===== */}
      {qParam && (
        <p className="mb-6 text-gray-600">
          Kết quả tìm kiếm cho: <span className="font-bold text-[#7B1E1E]">"{qParam}"</span>
        </p>
      )}

      {/* ===== LOADING ===== */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl border bg-gray-100" />
          ))}
        </div>
      )}

      {/* ===== ERROR ===== */}
      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Lỗi tải dữ liệu: {(error as Error)?.message}
        </div>
      )}

      {/* ===== EMPTY ===== */}
      {!isLoading && data && data.data.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
          <button 
            onClick={() => setUrl({ q: "" })}
            className="mt-4 text-[#7B1E1E] font-bold underline"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      )}

      {/* ===== PRODUCT GRID ===== */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.data.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl bg-[#FFF7ED] border border-[#7B1E1E]/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      {data && data.data.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            className="h-10 px-4 rounded-full border border-[#7B1E1E]/40 text-[#7B1E1E] hover:bg-[#7B1E1E]/10 disabled:opacity-30 transition"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            ← Trước
          </button>

          <span className="text-sm font-bold text-[#7B1E1E]">
            Trang {data.page}
          </span>

          <button
            className="h-10 px-4 rounded-full bg-[#7B1E1E] text-white hover:bg-[#651717] disabled:opacity-30 transition"
            onClick={() => setUrl({ page: pageParam + 1 })}
            disabled={!data.hasNext}
          >
            Sau →
          </button>
        </div>
      )}
    </main>
  );
}