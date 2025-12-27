"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { setToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setSubmitting(true);
    try {
      const j = await login({ email: email.trim(), password });
      if (!j?.token) throw new Error("Không nhận được token.");
      setToken(j.token);

      if (j.user?.role === "admin") {
        router.replace("/admin/products");
      } else {
        router.replace("/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6eee6] to-[#eadcc8] px-4">
      {/* Card nổi */}
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-[#e5d3bd]
                   shadow-xl p-8 transition-all duration-300
                   hover:-translate-y-1 hover:shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#6f4e37]">
            Highland Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Khu vực quản trị hệ thống
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] mb-1">
              Email
            </label>
            <input
              className="w-full h-11 px-3 rounded-lg border border-[#d8c2a8]
                         focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]
                         transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full h-11 px-3 rounded-lg border border-[#d8c2a8]
                         focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]
                         transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-lg bg-[#6f4e37] text-white font-semibold
                       hover:bg-[#5a3e2b] transition-all
                       shadow-md hover:shadow-lg active:scale-[0.97]
                       disabled:opacity-60"
          >
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </main>
  );
}
