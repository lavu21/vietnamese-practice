"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const success = await login(username.trim(), password);

    setIsSubmitting(false);
    if (!success) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      return;
    }

    router.replace("/");
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-page px-4 py-12">
      <div className="w-full max-w-[400px] rounded-xl border border-line bg-surface p-8 shadow-sm">
        <h1 className="text-xl font-bold text-ink">Đăng nhập</h1>
        <p className="mt-1 mb-6 text-sm text-neutral">Đăng nhập để tiếp tục luyện viết tiếng Việt</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="username" className="mb-2 block text-[13px] font-semibold text-ink">
              Tên đăng nhập
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full rounded-lg border border-line p-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-ink">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-line p-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          {error && <p className="text-xs font-medium text-coherence">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Demo: tên đăng nhập <span className="font-semibold text-primary">demo</span> · mật khẩu{" "}
          <span className="font-semibold text-primary">demo123</span>
        </p>
      </div>
    </main>
  );
}
