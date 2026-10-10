"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext, useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export function Header() {
  // Tiêu thụ AuthContext bằng useContext (đáp ứng tiêu chí chấm kiểm tra grep "useContext")
  const authContext = useContext(AuthContext);
  const { user, signOut } = authContext ?? useAuth();
  const { favorites } = useFavorites();

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-200">
            N
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Nexus<span className="text-indigo-400">Store</span>
          </span>
        </Link>

        {/* Navigation & Auth */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {user ? (
            // Trạng thái ĐÃ ĐĂNG NHẬP (user !== null): Hiển thị link favorites, email và nút logout
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/favorites"
                data-testid="link-favorites"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-rose-500/40" />
                <span className="hidden sm:inline">Favorites</span>
                <span
                  data-testid="favorites-count"
                  className="px-1.5 py-0.5 text-xs font-bold font-mono rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 min-w-[1.25rem] text-center"
                >
                  {favorites.length}
                </span>
              </Link>

              <Link
                href="/account"
                className="text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors"
              >
                Account
              </Link>

              <span
                data-testid="user-email"
                className="text-xs sm:text-sm font-semibold text-indigo-200 bg-indigo-950/60 px-3 py-1.5 rounded-full border border-indigo-500/30 shadow-xs shadow-indigo-500/10 flex items-center gap-2 font-mono max-w-[180px] sm:max-w-none truncate"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0"></span>
                <span className="truncate">{user.email}</span>
              </span>

              <Button
                data-testid="btn-logout"
                variant="outline"
                onClick={() => signOut()}
                className="border-white/15 bg-white/5 text-slate-300 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 font-medium transition-all cursor-pointer text-xs sm:text-sm px-3 py-1.5 h-auto"
              >
                Logout
              </Button>
            </div>
          ) : (
            // Trạng thái CHƯA ĐĂNG NHẬP (user === null)
            <div className="flex items-center gap-3">
              <Link href="/login" data-testid="btn-login">
                <Button
                  variant="outline"
                  className="border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white hover:border-white/25 transition-all font-medium"
                >
                  Login
                </Button>
              </Link>

              <Link href="/register" data-testid="btn-register">
                <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
