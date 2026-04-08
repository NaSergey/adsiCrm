"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchClient } from "@/shared";
import { setAccessToken } from "@/shared/lib/auth-token";
import {  Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    // УБРАЛИ setServerError(""); <-- Это ПЕРВАЯ причина мерцания
    
    try {
      const { data, response } = await fetchClient.POST("/api/auth/login", { body: values });

      if (!response.ok) {
        // Устанавливаем ошибку ТОЛЬКО если запрос реально упал
        const message = response.status === 401 
          ? "Incorrect email or password." 
          : "Login failed. Please try again.";
        
        console.log("Setting error:", message); // Проверь консоль!
        setServerError(message);
        return;
      }

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        router.push("/campaign");
      }
    } catch (err) {
      setServerError("Could not connect to server.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-1100 px-4">
      <div className="w-full max-w-100">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex  items-center justify-center rounded-xl">
            <Logo size="lg" />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-white/6 bg-gray-1000/60 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col gap-1.5">
            <Input label="Email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-500">Password</span>
            <div className="relative flex items-center gap-2 rounded-md bg-gray-1000 px-3 h-9">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 bg-transparent text-sm text-white outline-none"
                {...register("password")}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(onSubmit)()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          {/* Ошибка теперь привязана к жесткому стейту, который не сбрасывается в начале клика */}
          {serverError && (
            <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20">
              {serverError}
            </div>
          )}

          <Button 
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
            variant="blue" 
            size="lg"
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </div>
    </div>
  );
}