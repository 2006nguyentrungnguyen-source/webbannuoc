"use client";

import type { Product } from "@/types/product";
import Link from "next/link";
import { useCart } from "@/features/cart/cart-context"; // Phải có cái này
import { useRouter } from "next/navigation";           // Phải có cái này

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { dispatch } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    // Nếu bấm mà không thấy gì, hãy thêm dòng console.log này để kiểm tra
    console.log("Đang thêm sản phẩm:", product);

    dispatch({
      type: "ADD",
      payload: {
        productId: product._id || (product as any)._id, // Quan trọng: kiểm tra id hay _id
        title: product.title,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
        quantity: 1,
      },
    });

    router.push("/cart");
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border bg-[#fff7ed] shadow-sm transition hover:shadow-md">
      <div className="h-[260px] w-full overflow-hidden rounded-t-2xl bg-white">
        <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/shop/${product.slug}`} className="line-clamp-2 text-sm font-semibold">
          {product.title}
        </Link>
        <p className="mt-2 text-base font-bold">{product.price.toLocaleString()} đ</p>
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart} // Gắn hàm đã viết ở trên vào đây
            className="w-full rounded-xl border border-black bg-white py-2 text-sm font-medium hover:bg-black hover:text-white transition"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}