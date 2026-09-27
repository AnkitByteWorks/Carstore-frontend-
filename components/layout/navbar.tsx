"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  Menu,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Package,
  Heart,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth-store";
import { authApi } from "@/lib/api/auth";
import { useGarageStore } from "@/lib/store/garage-store";
import { useCompareStore } from "@/lib/store/compare-store";
import { CommandSearch } from "./command-search";
import { useState } from "react";
import { toast } from "sonner";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const { user, isAuthenticated, logout, isAdmin, refreshToken } = useAuthStore();
  const garageCount = useGarageStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);

  const handleLogout = async () => {
    const currentRefreshToken =
      refreshToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null);

    if (currentRefreshToken) {
      await authApi.logout(currentRefreshToken);
    }
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-gold" />
          <span className="font-playfair text-xl font-bold tracking-wide text-gradient-gold">
            CARSTORE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/cars"
            className="text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            Browse Fleet
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-amber-500/20 text-gold border border-amber-500/40 text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>
          <Link
            href="/garage"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            <Heart className="h-4 w-4" />
            <span>My Garage</span>
            {garageCount > 0 && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-bold flex items-center justify-center">
                {garageCount}
              </span>
            )}
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            About
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <CommandSearch />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="h-9 w-9 border border-gold/30 hover:border-gold transition">
                    <AvatarFallback className="bg-gold/10 text-gold text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-900 border-slate-800 text-white"
              >
                <DropdownMenuLabel className="text-slate-400">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">
                      {user?.username}
                    </span>
                    <span className="text-xs text-slate-500">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="focus:bg-slate-800 focus:text-gold">
                  <UserIcon className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <Link href="/garage">
                  <DropdownMenuItem className="focus:bg-slate-800 focus:text-gold cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Garage ({garageCount})
                  </DropdownMenuItem>
                </Link>
                <Link href="/compare">
                  <DropdownMenuItem className="focus:bg-slate-800 focus:text-gold cursor-pointer">
                    <ArrowLeftRight className="mr-2 h-4 w-4" />
                    Compare Fleet ({compareCount})
                  </DropdownMenuItem>
                </Link>
                <Link href="/orders">
                  <DropdownMenuItem className="focus:bg-slate-800 focus:text-gold cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                </Link>
                {isAdmin() && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <Link href="/admin">
                      <DropdownMenuItem className="focus:bg-slate-800 focus:text-gold cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="focus:bg-slate-800 focus:text-red-400 text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-slate-950"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="container mx-auto flex flex-col gap-4 p-4">
            <div className="pb-2 border-b border-slate-800">
              <CommandSearch />
            </div>
            <Link
              href="/cars"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-gold"
            >
              Browse Fleet
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between text-sm font-medium text-slate-300 hover:text-gold"
            >
              <span className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" /> Compare Fleet
              </span>
              {compareCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-gold text-xs font-bold">
                  {compareCount}
                </span>
              )}
            </Link>
            <Link
              href="/garage"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between text-sm font-medium text-slate-300 hover:text-gold"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> My Garage
              </span>
              {garageCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                  {garageCount}
                </span>
              )}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-gold"
            >
              About
            </Link>

            {isAuthenticated ? (
              <>
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-gold/30">
                    <AvatarFallback className="bg-gold/10 text-gold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {user?.username}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-left font-medium text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login">
                <Button className="w-full gradient-gold text-slate-950">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}