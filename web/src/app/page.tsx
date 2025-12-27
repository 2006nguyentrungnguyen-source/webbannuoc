import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFF7ED] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl">
        {/* CARD CHÍNH */}
        <div
          className="
            rounded-3xl
            bg-white
            border border-[#7B1E1E]/20
            shadow-xl
            p-8
            text-center
          "
        >
          {/* TIÊU ĐỀ */}
          <h1 className="text-4xl font-extrabold text-[#7B1E1E] tracking-wide">
            HIGHLANDS COFFEE
          </h1>

          <p className="mt-3 text-gray-600 text-lg">
            Hệ thống bán nước – giỏ hàng – quản trị
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* SHOP */}
            <Link
              href="/shop"
              className="
                group
                rounded-2xl
                border border-[#7B1E1E]/30
                p-6
                bg-[#FFF7ED]
                hover:bg-[#7B1E1E]
                transition-all
                duration-300
                shadow-md
              "
            >
              <div className="text-3xl mb-2 group-hover:text-white">☕</div>
              <h2 className="font-bold text-[#7B1E1E] group-hover:text-white">
                Mua đồ uống
              </h2>
              <p className="text-sm text-gray-600 group-hover:text-[#FFF7ED] mt-1">
                Thêm sản phẩm vào giỏ
              </p>
            </Link>

            {/* CART */}
            <Link
              href="/cart"
              className="
                group
                rounded-2xl
                border border-[#7B1E1E]/30
                p-6
                bg-[#FFF7ED]
                hover:bg-[#7B1E1E]
                transition-all
                duration-300
                shadow-md
              "
            >
              <div className="text-3xl mb-2 group-hover:text-white">🛒</div>
              <h2 className="font-bold text-[#7B1E1E] group-hover:text-white">
                Giỏ hàng
              </h2>
              <p className="text-sm text-gray-600 group-hover:text-[#FFF7ED] mt-1">
                Xem & thanh toán
              </p>
            </Link>

            {/* ADMIN */}
            <Link
              href="/admin"
              className="
                group
                rounded-2xl
                border border-[#7B1E1E]/30
                p-6
                bg-[#FFF7ED]
                hover:bg-[#7B1E1E]
                transition-all
                duration-300
                shadow-md
              "
            >
              <div className="text-3xl mb-2 group-hover:text-white">⚙️</div>
              <h2 className="font-bold text-[#7B1E1E] group-hover:text-white">
                Admin
              </h2>
              <p className="text-sm text-gray-600 group-hover:text-[#FFF7ED] mt-1">
                Quản lí sản phẩm
              </p>
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
           2025 Highlands Coffee 
        </p>
      </div>
    </main>
  );
}
