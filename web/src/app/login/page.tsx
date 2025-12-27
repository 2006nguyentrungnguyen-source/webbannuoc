"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/schemas";
import { useState } from "react";

export default function LoginPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng nhập thất bại");
      return;
    }
    setServerMsg("Đăng nhập thành công (mock)");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7efe5] to-[#efe2d2] px-4">
      {/* Card nổi kiểu Highland */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7d8c9] p-8
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#6f4e37]">
            Highland Coffee
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Đăng nhập để tiếp tục
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full h-11 px-3 rounded-lg border border-[#d8c2a8]
                         focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]
                         transition"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              disabled={isSubmitting}
              placeholder="ban@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">
              Mật khẩu
            </label>
            <input
              type="password"
              className="mt-1 w-full h-11 px-3 rounded-lg border border-[#d8c2a8]
                         focus:outline-none focus:ring-2 focus:ring-[#8b5e3c]
                         transition"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              disabled={isSubmitting}
              placeholder="••••••"
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full h-11 rounded-lg bg-[#6f4e37] text-white font-semibold
                       hover:bg-[#5a3e2b] transition-all
                       shadow-md hover:shadow-lg active:scale-[0.97]
                       disabled:opacity-50"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Server message */}
          {serverMsg && (
            <p className="text-sm text-center mt-2 text-[#6f4e37]">
              {serverMsg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
