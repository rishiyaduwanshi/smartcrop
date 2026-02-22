"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    Leaf,
    LayoutDashboard,
    CloudSun,
    Bug,
    TrendingUp,
    Users,
    Lightbulb,
    Menu,
    X,
    Bell,
    ChevronDown,
    LogOut,
    UserCircle,
} from "lucide-react";

const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/advisory", label: "Advisory", icon: Lightbulb },
    { href: "/weather", label: "Weather", icon: CloudSun },
    { href: "/pest-risk", label: "Pest Risk", icon: Bug },
    { href: "/market", label: "Market", icon: TrendingUp },
    { href: "/community", label: "Community", icon: Users },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const isActive = (href) => pathname === href;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-green-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-1.5 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div className="leading-tight">
                            <span className="font-bold text-green-800 text-lg">SmartCrop</span>
                            <span className="block text-[10px] text-green-500 font-medium -mt-1 tracking-wider uppercase">Advisor</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(href)
                                    ? "bg-green-100 text-green-800"
                                    : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Notification bell */}
                        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full pulse-green" />
                        </button>

                        {/* Language Selector */}
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-200 text-sm text-green-700 hover:bg-green-50 transition-colors">
                            <span className="text-xs">🇮🇳</span> Hindi
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Auth section */}
                        {status === "authenticated" && session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border border-green-200 text-sm font-medium text-green-800 hover:bg-green-50 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                                    </div>
                                    <span className="max-w-[100px] truncate">{session.user.name?.split(" ")[0]}</span>
                                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                        >
                                            <UserCircle className="w-4 h-4" /> Your Dashboard
                                        </Link>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/register"
                                    className="px-4 py-2 border border-green-600 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-green-100 bg-white px-4 pb-4 pt-2 space-y-1">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(href)
                                ? "bg-green-100 text-green-800"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-green-100">
                        {status === "authenticated" && session?.user ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                                        <p className="text-xs text-gray-500">{session.user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center px-4 py-2.5 border border-green-600 text-green-700 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
