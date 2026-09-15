"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Sign up modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    password: "",
    birthDay: "15",
    birthMonth: "9",
    birthYear: "2000",
    gender: "female",
  });
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: "Vui lòng nhập đầy đủ email/số di động và mật khẩu.", type: "error" });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ text: `Đăng nhập thành công với tài khoản: ${email}`, type: "success" });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ text: "Đang kết nối với Google... Đăng nhập thành công!", type: "success" });
    }, 1200);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpData.firstName || !signUpData.lastName || !signUpData.contact || !signUpData.password) {
      alert("Vui lòng điền đầy đủ các trường thông tin!");
      return;
    }
    setIsSignUpLoading(true);
    setTimeout(() => {
      setIsSignUpLoading(false);
      setIsSignUpOpen(false);
      setEmail(signUpData.contact);
      setMessage({
        text: `Tạo tài khoản thành công cho ${signUpData.lastName} ${signUpData.firstName}! Hãy đăng nhập.`,
        type: "success",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-[#1c1e21] flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans relative overflow-x-hidden">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : message.type === "error"
              ? "bg-rose-50 border-rose-300 text-rose-800"
              : "bg-blue-50 border-blue-300 text-blue-800"
          }`}
        >
          <span className="text-lg">
            {message.type === "success" ? "✓" : message.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="font-medium text-sm">{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-gray-400 hover:text-gray-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid Container */}
      <main className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-6 lg:py-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Section (approx 58% on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center select-none pt-4 lg:pt-0">
            {/* Facebook Logo */}
            <div className="mb-6 lg:mb-10">
              <svg className="w-12 h-12 text-[#0866ff]" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 0C8.954 0 0 8.954 0 20c0 9.98 7.311 18.253 16.875 19.756V25.781h-5.078v-5.781h5.078v-4.406c0-5.013 2.984-7.781 7.555-7.781 2.189 0 4.477.391 4.477.391v4.922h-2.522c-2.484 0-3.26 1.541-3.26 3.123v3.75h5.547l-.887 5.781h-4.66v13.975C32.689 38.253 40 29.98 40 20c0-11.046-8.954-20-20-20z" />
              </svg>
            </div>

            {/* Split row: Giant typography + Floating visual collage */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 lg:gap-8">
              {/* Bold Typography */}
              <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.04em] leading-[1.04] text-[#1c1e21]">
                Khám<br />
                phá<br />
                những<br />
                <span className="text-[#0866ff]">điều bạn</span><br />
                yêu<br />
                thích.
              </h1>

              {/* Visual Creative Cards Mockup */}
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[400px] sm:h-[430px] flex-shrink-0 self-center md:self-auto">
                {/* 3D Laughing reaction emoji */}
                <div className="absolute -top-3 left-4 z-20 animate-bounce duration-1000 shadow-lg rounded-full bg-amber-400 p-1.5 ring-4 ring-white">
                  <span className="text-3xl sm:text-4xl block transform hover:scale-125 transition-transform cursor-pointer">
                    😆
                  </span>
                </div>

                {/* Main Story Card (Portrait behind) */}
                <div className="absolute top-2 right-4 w-[210px] sm:w-[230px] h-[320px] sm:h-[340px] rounded-[28px] overflow-hidden shadow-2xl border-[5px] border-white bg-neutral-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                    alt="Story preview"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Time pill badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    16:45
                  </div>
                  {/* Story bottom reply pill */}
                  <div className="absolute bottom-3 inset-x-3 bg-black/40 backdrop-blur-md rounded-full py-1.5 px-3 flex items-center justify-between text-white text-xs border border-white/20">
                    <div className="h-2 w-14 bg-white/40 rounded-full"></div>
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[8px]">👍</span>
                      <span className="w-4 h-4 rounded-full border border-white/60 flex items-center justify-center text-[8px]">❤️</span>
                    </div>
                  </div>
                </div>

                {/* Left Mini Plant Card */}
                <div className="absolute top-12 left-0 w-[110px] h-[110px] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 bg-white group">
                  <img
                    src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=300&q=80"
                    alt="Plant potted"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 rounded-md p-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </div>
                </div>

                {/* Front Overlapping Post Card (Skatepark / Sunny) */}
                <div className="absolute bottom-6 left-2 sm:left-4 w-[170px] sm:w-[185px] bg-white rounded-2xl p-2.5 shadow-2xl border border-gray-100 z-20 transform hover:-translate-y-1 transition-transform">
                  <div className="relative h-[115px] rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=400&q=80"
                      alt="Skatepark outdoor"
                      className="w-full h-full object-cover"
                    />
                    {/* Blue bookmark ribbon */}
                    <div className="absolute top-2 left-2 bg-[#0866ff] text-white rounded-md p-1 shadow">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                      </svg>
                    </div>
                  </div>
                  {/* Skeleton activity lines */}
                  <div className="space-y-1.5 px-0.5">
                    <div className="h-2.5 w-3/4 bg-gray-200 rounded-full"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>

                {/* Floating Heart Reaction Badge */}
                <div className="absolute top-[210px] right-2 sm:right-3 z-30 transform hover:scale-110 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#fa3e3e] to-[#ff6060] flex items-center justify-center shadow-lg border-2 border-white text-white">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Circular Profile Avatar with Blue Ring */}
                <div className="absolute -bottom-2 left-[120px] sm:left-[135px] z-30">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-[3.5px] border-[#0866ff] overflow-hidden shadow-xl bg-white ring-4 ring-white">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Section (approx 42% on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center w-full">
            <div className="w-full max-w-[440px] bg-white lg:p-4 rounded-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1c1e21] mb-5 tracking-tight">
                Đăng nhập vào Facebook
              </h2>

              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Email / Mobile input */}
                <div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email hoặc số di động"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 text-base placeholder-gray-500 focus:outline-none focus:border-[#0866ff] focus:ring-4 focus:ring-blue-50 transition-all text-[#1c1e21]"
                  />
                </div>

                {/* Password input */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className="w-full px-4 py-3.5 rounded-2xl border border-gray-300 text-base placeholder-gray-500 focus:outline-none focus:border-[#0866ff] focus:ring-4 focus:ring-blue-50 transition-all text-[#1c1e21] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0866ff] hover:bg-[#075ce0] active:scale-[0.99] text-white font-bold py-3.5 rounded-full text-base transition-all duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span>Đăng nhập</span>
                </button>

                {/* Forgot Password */}
                <div className="text-center pt-1">
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setMessage({ text: "Vui lòng kiểm tra email hoặc liên hệ quản trị viên để lấy lại mật khẩu.", type: "info" });
                    }}
                    className="text-[#0866ff] hover:underline text-sm font-medium transition-colors"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                {/* Google Sign-in Option */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-full text-base transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer shadow-xs hover:border-gray-400"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Đăng nhập với Google</span>
                  </button>
                </div>

                {/* Divider Line */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="w-full border-t border-gray-200"></div>
                  <span className="absolute bg-white px-3 text-xs text-gray-500 uppercase tracking-wider font-medium">
                    hoặc
                  </span>
                </div>

                {/* Create Account Button */}
                <button
                  type="button"
                  onClick={() => setIsSignUpOpen(true)}
                  className="w-full bg-white border-2 border-[#0866ff] text-[#0866ff] hover:bg-blue-50/70 active:bg-blue-100 font-bold py-3.5 rounded-full text-base transition-all duration-150 cursor-pointer text-center"
                >
                  Tạo tài khoản mới
                </button>
              </form>

              {/* Meta Branding */}
              <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm mt-8 select-none">
                <svg className="w-4 h-4 text-gray-600 fill-current" viewBox="0 0 24 24">
                  <path d="M12 16.5c-2.3 0-4.3-1.6-4.9-3.8-.5-1.8.2-3.8 1.8-4.9 1.5-1 3.4-.9 4.8.3.4.4.8.4 1.2 0 1.4-1.2 3.3-1.3 4.8-.3 1.6 1.1 2.3 3.1 1.8 4.9-.6 2.2-2.6 3.8-4.9 3.8-1.5 0-3-.7-3.9-1.9-.9 1.2-2.4 1.9-3.9 1.9zm0-2c1.7 0 3.1-1.4 3.1-3.1 0-1.7-1.4-3.1-3.1-3.1-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.4 3.1 3.1 3.1z" />
                </svg>
                <span className="font-semibold text-gray-700">Meta</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Subtle Footer Language Links */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center lg:justify-start">
          <span className="text-gray-800 font-medium">Tiếng Việt</span>
          <a href="#" className="hover:underline">English (UK)</a>
          <a href="#" className="hover:underline">Français (France)</a>
          <a href="#" className="hover:underline">Español</a>
          <a href="#" className="hover:underline">Português (Brasil)</a>
          <a href="#" className="hover:underline">Italiano</a>
          <a href="#" className="hover:underline">Deutsch</a>
          <a href="#" className="hover:underline">中文(台灣)</a>
          <a href="#" className="hover:underline">日本語</a>
        </div>
        <div className="text-center lg:text-left text-gray-400 mt-2">
          Meta © 2026 • Được thiết kế theo phong cách Facebook
        </div>
      </footer>

      {/* Sign Up Modal (Tạo tài khoản mới) */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[432px] overflow-hidden border border-gray-100 transition-all transform animate-scaleUp"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1c1e21]">Đăng ký</h3>
                <p className="text-gray-500 text-sm mt-0.5">Nhanh chóng và dễ dàng.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSignUpOpen(false)}
                className="text-gray-500 hover:text-gray-800 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSignUpSubmit} className="p-4 space-y-3.5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Họ"
                  value={signUpData.lastName}
                  onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <input
                  type="text"
                  required
                  placeholder="Tên"
                  value={signUpData.firstName}
                  onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Email or Phone */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Số di động hoặc email"
                  value={signUpData.contact}
                  onChange={(e) => setSignUpData({ ...signUpData, contact: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  required
                  placeholder="Mật khẩu mới"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-gray-50/50 text-sm focus:bg-white focus:outline-none focus:border-[#0866ff] focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Ngày sinh
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={signUpData.birthDay}
                    onChange={(e) => setSignUpData({ ...signUpData, birthDay: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#0866ff]"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={signUpData.birthMonth}
                    onChange={(e) => setSignUpData({ ...signUpData, birthMonth: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#0866ff]"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>Tháng {m}</option>
                    ))}
                  </select>
                  <select
                    value={signUpData.birthYear}
                    onChange={(e) => setSignUpData({ ...signUpData, birthYear: e.target.value })}
                    className="px-2.5 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:border-[#0866ff]"
                  >
                    {Array.from({ length: 100 }, (_, i) => 2026 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Giới tính
                </label>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {[
                    { label: "Nữ", value: "female" },
                    { label: "Nam", value: "male" },
                    { label: "Tùy chỉnh", value: "custom" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-colors ${
                        signUpData.gender === item.value
                          ? "border-[#0866ff] bg-blue-50/50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-gray-800">{item.label}</span>
                      <input
                        type="radio"
                        name="gender"
                        value={item.value}
                        checked={signUpData.gender === item.value}
                        onChange={(e) => setSignUpData({ ...signUpData, gender: e.target.value })}
                        className="text-[#0866ff] focus:ring-[#0866ff]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Policy terms */}
              <p className="text-[11px] text-gray-500 leading-tight pt-1">
                Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
                <span className="text-[#0866ff] cursor-pointer hover:underline">Điều khoản</span>,{" "}
                <span className="text-[#0866ff] cursor-pointer hover:underline">Chính sách quyền riêng tư</span> và{" "}
                <span className="text-[#0866ff] cursor-pointer hover:underline">Chính sách cookie</span> của chúng tôi.
              </p>

              {/* Submit button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSignUpLoading}
                  className="w-full sm:w-3/4 mx-auto bg-[#42b72a] hover:bg-[#36a420] text-white font-bold py-2.5 px-6 rounded-xl text-base shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSignUpLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  <span>Đăng ký</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}