"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, Search, Menu, LogOut, User as UserIcon, LayoutDashboard, Package } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();

  const handleLogout = () => {
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
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/cars"
            className="text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            Browse Cars
          </Link>
          <Link
            href="/brands"
            className="text-sm font-medium text-slate-300 hover:text-gold transition"
          >
            Brands
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
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-gold"
          >
            <Search className="h-5 w-5" />
          </Button>

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
            <Link
              href="/cars"
              className="text-sm font-medium text-slate-300 hover:text-gold"
            >
              Browse Cars
            </Link>
            <Link
              href="/brands"
              className="text-sm font-medium text-slate-300 hover:text-gold"
            >
              Brands
            </Link>
            <Link
              href="/about"
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