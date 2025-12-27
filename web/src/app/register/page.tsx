"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { useState } from "react";

export default function RegisterPage() {
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json();
      setServerMsg(data?.message ?? "Đăng ký thất bại");
      return;
    }
    setServerMsg("Đăng ký thành công (mock)");
  }

  const pwd = watch("password");

  return (
    <main className="py-14 flex justify-center">
      {/* ===== CARD HIGHLAND ===== */}
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-white
          border border-[#8B1E1E]/30
          shadow-xl
          p-8
        "
      >
        {/* TITLE */}
        <h1
          className="
            text-3xl font-extrabold
            text-[#8B1E1E]
            text-center
            tracking-wide
          "
        >
          Đăng ký
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          {/* HỌ TÊN */}
          <div>
            <label className="block text-sm font-semibold">
              Họ tên
            </label>
            <input
              className="
                mt-1 w-full h-11 px-4
                rounded-full
                border
                focus:outline-none
                focus:ring-2 focus:ring-[#8B1E1E]/40
                transition
              "
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
              disabled={isSubmitting}
              placeholder="Nguyễn Văn A"
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              className="
                mt-1 w-full h-11 px-4
                rounded-full
                border
                focus:outline-none
                focus:ring-2 focus:ring-[#8B1E1E]/40
                transition
              "
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              disabled={isSubmitting}
              placeholder="ban@example.com"
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              className="
                mt-1 w-full h-11 px-4
                rounded-full
                border
                focus:outline-none
                focus:ring-2 focus:ring-[#8B1E1E]/40
                transition
              "
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              disabled={isSubmitting}
              placeholder="••••••"
            />
            {errors.password && (
              <p
                id="password-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM */}
          <div>
            <label className="block text-sm font-semibold">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              className="
                mt-1 w-full h-11 px-4
                rounded-full
                border
                focus:outline-none
                focus:ring-2 focus:ring-[#8B1E1E]/40
                transition
              "
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? "confirm-error" : undefined
              }
              {...register("confirmPassword")}
              disabled={isSubmitting}
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <p
                id="confirm-error"
                className="mt-1 text-sm text-red-600"
              >
                {errors.confirmPassword.message}
              </p>
            )}
            {pwd && !errors.confirmPassword && (
              <p className="mt-1 text-xs text-gray-500">
                Mẹo: dùng mật khẩu ≥ 6 ký tự
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="
              w-full h-12
              rounded-full
              bg-[#8B1E1E]
              text-white
              font-extrabold
              tracking-wide
              shadow-md
              hover:bg-[#6f1717]
              active:scale-95
              transition-all
              disabled:opacity-50
            "
          >
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {/* SERVER MSG */}
          {serverMsg && (
            <p
              className="
                text-sm text-center
                font-medium
                text-[#8B1E1E]
              "
            >
              {serverMsg}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
