"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchClient } from "@/shared/api";
import { setAccessToken } from "@/shared/lib/auth-token";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Form } from "@/shared/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { register, formState: { errors, isSubmitting } } = methods;

  async function onSubmit(values: LoginFormValues) {
    setServerError("");
    let data, response;
    try {
      ({ data, response } = await fetchClient.POST("/auth/login", { body: values }));
    } catch {
      setServerError("Could not connect to server. Is the backend running?");
      return;
    }
    if (!response.ok) {
      if (response.status === 401) setServerError("Incorrect email or password.");
      else setServerError("Login failed. Please try again.");
      return;
    }
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      router.push("/campaign");
      router.refresh();
    } else {
      setServerError("Invalid response from server.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-1100 px-4">
      <div className="w-full max-w-100">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <Lock className="size-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">Pixel CRM</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/6 bg-gray-1000/60 p-6 shadow-xl backdrop-blur-sm">
          <Form methods={methods} onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="admin@admin.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-500">Password</span>
              <label className="flex items-center gap-2 rounded-md bg-gray-1000 px-3 h-9 text-sm outline-none transition-colors focus-within:ring-2 focus-within:ring-transparent focus-within:ring-offset-2 focus-within:ring-offset-blue-600">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500 [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="auto"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-gray-500 hover:text-gray-300 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </label>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
                {serverError}
              </p>
            )}

            <Button type="submit" variant="blue" size="lg" disabled={isSubmitting} className="mt-1 w-full">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
