"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side validation logic từ Lab 2
  const validateFullName = (val: string): string | undefined => {
    if (!val.trim()) {
      return "Full name is required";
    }
    return undefined;
  };

  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) {
      return "Password is required";
    }
    if (val.length < 6) {
      return "Password must be at least 6 characters";
    }
    return undefined;
  };

  const validateConfirmPassword = (
    val: string,
    currentPassword: string
  ): string | undefined => {
    if (!val) {
      return "Confirm password is required";
    }
    if (val !== currentPassword) {
      return "Passwords do not match";
    }
    return undefined;
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFullName(val);
    setAuthError(null);
    if (hasSubmitted) {
      const err = validateFullName(val);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.fullName = err;
        } else {
          delete next.fullName;
        }
        return next;
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setAuthError(null);
    if (hasSubmitted) {
      const err = validateEmail(val);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.email = err;
        } else {
          delete next.email;
        }
        return next;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setAuthError(null);
    if (hasSubmitted) {
      const err = validatePassword(val);
      const confirmErr = confirmPassword
        ? validateConfirmPassword(confirmPassword, val)
        : errors.confirmPassword;

      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.password = err;
        } else {
          delete next.password;
        }

        if (confirmPassword) {
          if (confirmErr) {
            next.confirmPassword = confirmErr;
          } else {
            delete next.confirmPassword;
          }
        }
        return next;
      });
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    setConfirmPassword(val);
    setAuthError(null);
    if (hasSubmitted) {
      const err = validateConfirmPassword(val, password);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) {
          next.confirmPassword = err;
        } else {
          delete next.confirmPassword;
        }
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    setAuthError(null);
    setSuccessMessage(null);

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);

    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (nameErr) newErrors.fullName = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);

    // Khi client validation hợp lệ, gọi Supabase signUp
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const { data, error } = await signUp(email.trim(), password, {
          data: {
            full_name: fullName.trim(),
            name: fullName.trim(),
          },
        });
        if (error) {
          // Hiển thị trực tiếp thông điệp lỗi của Supabase vào data-testid="error-auth"
          setAuthError(error.message);
        } else if (data?.user?.identities && data.user.identities.length === 0) {
          // Khi email đã tồn tại trong Supabase, identities trả về mảng rỗng [] -> Báo lỗi tài khoản đã đăng ký
          setAuthError("User already registered");
        } else {
          // Lưu tên vào localStorage để dự phòng
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "user_full_name_" + email.trim().toLowerCase(),
              fullName.trim()
            );
          }
          // Đăng ký thành công -> hiển thị data-testid="form-success"
          setSuccessMessage("Registration successful");
          setPassword("");
          setConfirmPassword("");
          setErrors({});
        }
      } catch (err: any) {
        setAuthError(err?.message || "An unexpected error occurred during registration");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 font-sans relative overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10 blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              N
            </div>
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Nexus<span className="text-indigo-400">Store</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-2xl shadow-black/60 border border-white/10 bg-slate-900/80 backdrop-blur-2xl">
          <CardHeader className="space-y-1.5 text-center pb-6">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-white">
              Create an Account
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Supabase Auth Error Banner (chỉ hiển thị khi Supabase trả về lỗi) */}
            {authError && (
              <div
                data-testid="error-auth"
                className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-2.5 backdrop-blur-md shadow-inner"
              >
                <svg
                  className="w-5 h-5 text-red-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{authError}</span>
              </div>
            )}

            {/* Success Message Banner (chỉ hiển thị khi đăng ký thành công) */}
            {successMessage && (
              <div
                data-testid="form-success"
                className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2.5 backdrop-blur-md shadow-inner"
              >
                <svg
                  className="w-5 h-5 text-emerald-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            <form
              noValidate
              onSubmit={handleSubmit}
              data-testid="register-form"
              className="space-y-4"
            >
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-slate-200 font-medium text-xs">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={handleFullNameChange}
                  data-testid="register-name"
                  className={`bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 ${
                    errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p
                    data-testid="error-name"
                    className="text-xs font-medium text-red-400 mt-1"
                  >
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-200 font-medium text-xs">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  data-testid="register-email"
                  className={`bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 ${
                    errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p
                    data-testid="error-email"
                    className="text-xs font-medium text-red-400 mt-1"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-200 font-medium text-xs">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={handlePasswordChange}
                  data-testid="register-password"
                  className={`bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 ${
                    errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p
                    data-testid="error-password"
                    className="text-xs font-medium text-red-400 mt-1"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-slate-200 font-medium text-xs">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  data-testid="register-confirm-password"
                  className={`bg-slate-950/70 border-white/15 text-white placeholder:text-slate-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-10 ${
                    errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p
                    data-testid="error-confirm-password"
                    className="text-xs font-medium text-red-400 mt-1"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="register-submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-2.5 mt-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 transition-all cursor-pointer h-10"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-2.5 text-center text-sm text-slate-400 pt-0 pb-6 border-t border-white/5 mt-4">
            <div className="pt-3">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-400 hover:text-cyan-300 transition-colors"
              >
                Sign In
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
