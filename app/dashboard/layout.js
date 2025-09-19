"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/admin/me`,
          {
            method: "GET",
            credentials: "include", // send cookies
          }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Expected JSON response but got:", contentType);
          router.push("/login");
          return;
        }

        const data = await res.json();
        setAdmin(data); // ✅ set admin state
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false); // ✅ hide loader
      }
    };

    verifyAdmin();

    // Set initial sidebar visibility based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/admin/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // Don't try to parse response as JSON for logout
      if (!res.ok) {
        console.warn("Logout request failed, but continuing...");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.push("/login");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Navbar */}
      <nav
        className="text-white p-4 flex justify-between items-center relative z-50 flex-shrink-0 shadow-xl bg-white border-b border-gray-100 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          {/* Menu Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-sm"
            title={sidebarVisible ? "Hide Menu" : "Show Menu"}
          >
            <i className="fas fa-bars text-gray-700 text-xl"></i>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/hailogo.png"
                alt="Haldar AI & IT Logo"
                width={40}
                height={40}
                className="h-10 w-auto rounded-lg shadow-md"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Haldar AI & IT
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {admin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <i className="fas fa-user-circle text-blue-500 text-lg"></i>
              <span className="text-gray-700 font-medium">{admin.email}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Section - Takes remaining height */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Fixed Sidebar */}
        <aside
          className={`${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 transition-all duration-300 border-r border-gray-200 z-40 flex-shrink-0 bg-white shadow-2xl backdrop-blur-sm`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    if (window.innerWidth < 1024) setSidebarVisible(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-800 border-b border-gray-100 hover:border-l-4 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
                >
                  <i className="fas fa-tachometer-alt text-blue-500 text-lg group-hover:scale-110 transition-transform duration-200"></i>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push("/dashboard/petitions");
                    if (window.innerWidth < 1024) setSidebarVisible(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-800 border-b border-gray-100 hover:border-l-4 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
                >
                  <i className="fas fa-file-alt text-green-500 text-lg group-hover:scale-110 transition-transform duration-200"></i>
                  Petitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push("/dashboard/successfulpetitions");
                    if (window.innerWidth < 1024) setSidebarVisible(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-800 border-b border-gray-100 hover:border-l-4 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
                >
                  <i className="fas fa-check-circle text-purple-500 text-lg group-hover:scale-110 transition-transform duration-200"></i>
                  Successful Petitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    router.push("/dashboard/petition-approval");
                    if (window.innerWidth < 1024) setSidebarVisible(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-800 border-b border-gray-100 hover:border-l-4 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:shadow-lg transition-all duration-300 flex items-center gap-3 group"
                >
                  <i className="fas fa-clock text-orange-500 text-lg group-hover:scale-110 transition-transform duration-200"></i>
                  Petition Approval
                </button>
              </li>
            </ul>
          </div>
        </aside>

        {/* Mobile Overlay - Only shows on mobile when sidebar is open */}
        {sidebarVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden top-16"
            onClick={() => setSidebarVisible(false)}
          ></div>
        )}

        {/* Scrollable Main Content */}
        <main
          className={`flex-1 bg-gradient-to-br from-gray-50 to-white transition-all duration-300 overflow-hidden ${
            sidebarVisible ? "lg:ml-64" : "ml-0"
          }`}
        >
          {/* Content wrapper with scroll */}
          <div className="h-full overflow-y-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
