"use client";

import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { state, dispatch, subtotal, hydrated } = useCart();
  const [history, setHistory] = useState<any[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ✅ THÔNG TIN KHÁCH HÀNG
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "cod", // cod | bank
  });

  // Load lịch sử đơn hàng
  useEffect(() => {
    if (hydrated) {
      const savedHistory = JSON.parse(
        localStorage.getItem("hl_history") || "[]"
      );
      setHistory(savedHistory);
    }
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B1E1E] border-t-transparent"></div>
      </div>
    );
  }

  const items = state.items;
  const shipping = items.length ? 15000 : 0;
  const total = subtotal + shipping;

  // ✅ ĐẶT HÀNG
  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!customer.name || !customer.phone || !customer.address) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    const newOrder = {
      orderId: `HL-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toLocaleString("vi-VN"),
      items: [...items],
      totalPrice: total,
      customer,
    };

    const updatedHistory = [newOrder, ...history];
    localStorage.setItem("hl_history", JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    dispatch({ type: "CLEAR" });
    setOrderSuccess(true);
  };

  const updateQuantity = (productId: string, qty: number) => {
    dispatch({
      type: "SET_QTY",
      payload: { productId, quantity: Math.max(1, qty) },
    });
  };

  return (
    <main className="container mx-auto px-4 py-10 max-w-6xl">
      {/* ===== THÔNG BÁO ===== */}
      {orderSuccess && (
        <div className="mb-8 rounded-2xl bg-green-50 border p-6 text-center">
          <h3 className="text-lg font-black text-green-600">
            🎉 Đặt hàng thành công!
          </h3>
          <p className="text-sm text-green-700">
            Đơn hàng đã được lưu vào lịch sử.
          </p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="mt-4 font-bold underline"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ===== GIỎ HÀNG ===== */}
      <div className="flex items-end justify-between border-b pb-6">
        <h1 className="text-4xl font-extrabold text-[#8B1E1E]">
          Giỏ hàng
        </h1>
        <p>({items.length} sản phẩm)</p>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p>Giỏ hàng trống</p>
          <Link href="/shop" className="underline text-[#8B1E1E]">
            Đến cửa hàng
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div
                key={it.productId}
                className="flex gap-4 p-4 bg-white rounded-xl border"
              >
                <div className="relative h-20 w-20">
                  <Image
                    src={it.image || "/placeholder.png"}
                    alt={it.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between font-bold">
                    <span>{it.title}</span>
                    <span className="text-[#8B1E1E]">
                      {formatVND(it.price)}
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <div className="flex border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity - 1)
                        }
                        className="px-3"
                      >
                        -
                      </button>
                      <span className="px-3">{it.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(it.productId, it.quantity + 1)
                        }
                        className="px-3"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        dispatch({
                          type: "REMOVE",
                          payload: { productId: it.productId },
                        })
                      }
                      className="text-red-400 underline"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* THANH TOÁN */}
          <aside className="bg-[#FDF2F2] p-6 rounded-3xl">
            <h2 className="font-black text-[#8B1E1E] mb-4">
              Thanh toán
            </h2>

            {/* THÔNG TIN KHÁCH */}
            <div className="space-y-3 mb-4">
              <input
                placeholder="Họ và tên"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="w-full border px-4 py-3 rounded-xl"
              />
              <input
                placeholder="Số điện thoại"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                className="w-full border px-4 py-3 rounded-xl"
              />
              <textarea
                placeholder="Địa chỉ giao hàng"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
                className="w-full border px-4 py-3 rounded-xl"
              />

              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={customer.payment === "cod"}
                  onChange={() =>
                    setCustomer({ ...customer, payment: "cod" })
                  }
                />
                Thanh toán khi nhận hàng
              </label>

              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={customer.payment === "bank"}
                  onChange={() =>
                    setCustomer({ ...customer, payment: "bank" })
                  }
                />
                Chuyển khoản ngân hàng
              </label>
            </div>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ship</span>
                <span>{formatVND(shipping)}</span>
              </div>
              <div className="flex justify-between font-black">
                <span>Tổng</span>
                <span className="text-[#8B1E1E]">
                  {formatVND(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 w-full py-4 bg-[#8B1E1E] text-white rounded-2xl font-bold"
            >
              ĐẶT HÀNG NGAY
            </button>
          </aside>
        </div>
      )}

      {/* ===== LỊCH SỬ ===== */}
      <div className="mt-20">
        <h2 className="font-black mb-6">Lịch sử mua hàng</h2>

        {history.length === 0 ? (
          <p className="italic text-gray-400 text-center">
            Chưa có đơn hàng
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {history.map((order, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-xl bg-gray-50"
              >
                <p className="font-bold text-[#8B1E1E]">
                  {order.orderId}
                </p>
                <p className="text-xs text-gray-400">
                  {order.date}
                </p>
                <p className="mt-2 font-bold">
                  {formatVND(order.totalPrice)}
                </p>

                <p className="text-xs mt-2">
                  👤 {order.customer?.name} – 📞{" "}
                  {order.customer?.phone}
                </p>
                <p className="text-xs">
                  📍 {order.customer?.address}
                </p>
                <p className="text-xs font-bold">
                  💳{" "}
                  {order.customer?.payment === "cod"
                    ? "COD"
                    : "Chuyển khoản"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
