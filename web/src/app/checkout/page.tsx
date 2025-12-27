"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/mock/products"; // Giả định path
import { calcTotals } from "@/lib/checkout"; // Giả định path

// --- Icons (Dùng SVG trực tiếp để không cần cài thư viện) ---
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-green-500 mx-auto" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" className="text-green-100 fill-green-50" stroke="none" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Utility Functions ---
function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// --- Main Component ---
export default function CheckoutPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // 1. Xử lý dữ liệu giỏ hàng (Logic cũ)
  const itemsParam = sp.get("items") || "";
  const parsed = useMemo(() => {
    const list = itemsParam.split(",").map((p) => p.trim()).filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });
    return list.map((it) => {
        const p = PRODUCTS.find((x) => x.slug === it.slug);
        return p ? { ...it, product: p } : null;
      }).filter(Boolean) as { slug: string; quantity: number; product: (typeof PRODUCTS)[number] }[];
  }, [itemsParam]);

  const totals = useMemo(() => calcTotals(parsed.map((x) => ({ price: x.product.price, quantity: x.quantity })), ""), [parsed]);

  // 2. State quản lý Form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState("cod");
  const [note, setNote] = useState("");
  
  // State xử lý submit
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null); // Chứa thông tin đơn hàng thành công
  const [error, setError] = useState<string | null>(null);

  // 3. Hàm Xử lý Đặt hàng (Giả lập)
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!parsed.length) return setError("Giỏ hàng trống.");
    if (!name || !addr) return setError("Vui lòng nhập đủ thông tin.");

    setSubmitting(true);
    try {
      // Giả lập delay mạng 1.5s
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Tạo kết quả giả
      const mockOrder = {
        id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
        customerName: name,
        total: totals.total,
        createdAt: new Date().toLocaleString("vi-VN")
      };
      
      setResult(mockOrder); // Kích hoạt hiện Popup
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  // --- Render ---
  return (
    <div className="relative min-h-screen pb-20">
      
      {/* --- PHẦN SUCCESS MODAL (POPUP) --- */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header của Modal */}
            <div className="bg-green-50 p-6 text-center border-b border-green-100">
              <div className="mb-4 transform scale-125">
                <CheckIcon />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-1">Đặt hàng thành công!</h2>
              <p className="text-green-600 text-sm">Cảm ơn bạn đã mua sắm tại Shoply</p>
            </div>

            {/* Nội dung chi tiết đơn */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Mã đơn hàng</span>
                <span className="font-mono font-bold text-gray-900">{result.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Khách hàng</span>
                <span className="font-medium">{result.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed">
                <span className="text-gray-500">Tổng thanh toán</span>
                <span className="font-bold text-xl text-red-600">{formatVND(result.total)}</span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 text-center">
                Đơn hàng xác nhận lúc: {result.createdAt}
              </div>
            </div>

            {/* Nút bấm */}
            <div className="p-6 pt-0 flex flex-col gap-3">
              <button 
                onClick={() => router.push("/")}
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
              >
                Tiếp tục mua sắm
              </button>
              <button 
                onClick={() => setResult(null)} // Đóng modal để xem lại form (nếu muốn)
                className="w-full py-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PHẦN FORM CHÍNH (Nền) --- */}
      <section className="grid md:grid-cols-3 gap-8">
        {/* Cột trái: Form nhập liệu */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          
          <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
            <h2 className="font-semibold text-lg border-b pb-2">Thông tin giao hàng</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                  value={name} onChange={e => setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                  value={phone} onChange={e => setPhone(e.target.value)} placeholder="VD: 0909..." />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
              <textarea required rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                value={addr} onChange={e => setAddr(e.target.value)} placeholder="Số nhà, tên đường, phường/xã..." />
            </div>

            <div className="space-y-1">
               <label className="text-sm font-medium text-gray-700">Ghi chú</label>
               <input className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition" 
                 value={note} onChange={e => setNote(e.target.value)} placeholder="Lời nhắn cho shipper..." />
            </div>

            <div className="pt-4">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Phương thức thanh toán</label>
              <div className="grid grid-cols-3 gap-3">
                {['cod', 'banking', 'momo'].map((method) => (
                  <label key={method} 
                    className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all
                    ${pm === method ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'hover:border-gray-400'}`}>
                    <input type="radio" name="pm" value={method} checked={pm === method} onChange={() => setPM(method)} className="hidden" />
                    <span className="uppercase font-bold text-sm tracking-wide">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">⚠️ {error}</div>}

            <div className="pt-4 flex gap-4">
               <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-xl border border-gray-300 font-medium text-gray-600 hover:bg-gray-50 transition"
               >
                 Quay lại
               </button>
               <button 
                 type="submit" 
                 disabled={submitting || parsed.length === 0}
                 className="flex-1 bg-black text-white rounded-xl py-3 font-bold text-lg shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
               >
                 {submitting ? "Đang xử lý..." : `Thanh toán ${formatVND(totals.total)}`}
               </button>
            </div>
          </form>
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <aside className="h-fit space-y-6">
          <div className="bg-gray-50 p-5 rounded-2xl border">
            <h3 className="font-bold text-gray-900 mb-4">Đơn hàng của bạn</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {parsed.map((x) => (
                <div key={x.slug} className="flex gap-3 items-start">
                   <div className="w-16 h-16 bg-white rounded-lg border flex-shrink-0 overflow-hidden relative">
                      <img src={x.product.images?.[0] || "/placeholder.png"} alt="" className="w-full h-full object-cover"/>
                      <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">{x.quantity}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{x.product.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{x.product.category || "Giày"}</p>
                      <p className="text-sm font-semibold mt-1">{formatVND(x.product.price)}</p>
                   </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-dashed my-4"></div>
            
            <div className="space-y-2 text-sm text-gray-600">
               <div className="flex justify-between"><span>Tạm tính</span> <span>{formatVND(totals.subtotal)}</span></div>
               <div className="flex justify-between"><span>Phí ship</span> <span>{formatVND(totals.shippingFee)}</span></div>
            </div>
            
            <div className="border-t my-4"></div>
            
            <div className="flex justify-between items-center">
               <span className="font-bold text-gray-900">Tổng cộng</span>
               <span className="font-bold text-2xl text-black">{formatVND(totals.total)}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}