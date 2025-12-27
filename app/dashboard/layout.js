"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${apiUrl}/api/admin/me`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setAdmin(data.admin);
                } else {
                    router.push("/login");
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            await fetch(`${apiUrl}/api/admin/logout`, {
                method: "POST",
                credentials: "include",
            });
            router.push("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: "fas fa-home",
            color: "from-blue-500 to-blue-600",
        },
        {
            name: "Petition Approval",
            href: "/dashboard/petition-approval",
            icon: "fas fa-check-circle",
            color: "from-green-500 to-green-600",
        },
        {
            name: "All Petitions",
            href: "/dashboard/petitions",
            icon: "fas fa-file-alt",
            color: "from-purple-500 to-purple-600",
        },
        {
            name: "Successful Petitions",
            href: "/dashboard/successfulpetitions",
            icon: "fas fa-trophy",
            color: "from-yellow-500 to-yellow-600",
        },
        {
            name: "Ads Management",
            href: "/dashboard/ads",
            icon: "fas fa-ad",
            color: "from-pink-500 to-pink-600",
        },
    ];

    const isActive = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-lock text-blue-600 text-xl"></i>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background pattern */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none"></div>
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none"></div>

            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200/50 shadow-xl z-50 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                    } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-shield-alt text-white text-lg"></i>
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Admin
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <i className={`fas ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"} text-gray-500 text-sm`}></i>
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <i className="fas fa-times text-gray-500"></i>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(item.href)
                                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <i className={`${item.icon} text-lg ${isActive(item.href) ? "" : "text-gray-400 group-hover:text-gray-600"}`}></i>
                            {sidebarOpen && (
                                <span className="font-medium">{item.name}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 ${sidebarOpen ? "" : "justify-center"
                            }`}
                    >
                        <i className="fas fa-sign-out-alt text-lg"></i>
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main
                className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"
                    }`}
            >
                {/* Top header */}
                <header className="h-20 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <i className="fas fa-bars text-gray-600 text-lg"></i>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
                            SOSign Admin Panel
                        </h1>
                    </div>

                    {/* Admin info */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800">
                                {admin?.email || "Admin"}
                            </p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <i className="fas fa-user text-white"></i>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="relative z-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
