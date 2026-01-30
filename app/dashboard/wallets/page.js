"use client";

import { useState, useEffect } from "react";

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWallets, setTotalWallets] = useState(0);
  const [search, setSearch] = useState("");
  const [filteredWallets, setFilteredWallets] = useState([]);

  // Fetch wallets from backend
  const fetchWallets = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/wallets?page=${page}&limit=10`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }

      const data = await response.json();
      setWallets(data.wallets);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalWallets(data.totalWallets);
      setFilteredWallets(data.wallets);
    } catch (err) {
      setError("Failed to load wallets: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets(1);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    const filtered = wallets.filter(
      (wallet) =>
        wallet.userId?.name.toLowerCase().includes(value) ||
        wallet.userId?.email.toLowerCase().includes(value) ||
        wallet.userId?.mobileNumber?.includes(value) ||
        wallet.userId?.uniqueCode?.toLowerCase().includes(value)
    );

    setFilteredWallets(filtered);
  };

  // Calculate total balance
  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);

  // Get top wallets
  const topWallets = [...wallets].sort((a, b) => b.balance - a.balance).slice(0, 5);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            User Wallet Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage all user wallet balances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Users with Wallets */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Wallets</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{totalWallets}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          {/* Total Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ₹{totalBalance.toFixed(2)}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-coins text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          {/* Average Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Average Balance</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  ₹{totalWallets > 0 ? (totalBalance / totalWallets).toFixed(2) : "0"}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-pie text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          {/* Highest Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Highest Balance</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  ₹{topWallets.length > 0 ? topWallets[0].balance.toFixed(2) : "0"}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Wallets */}
        {topWallets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-crown text-yellow-500"></i>
              Top 5 Wallets
            </h2>
            <div className="space-y-3">
              {topWallets.map((wallet, index) => (
                <div
                  key={wallet._id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-150 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{wallet.userId?.name}</p>
                      <p className="text-sm text-gray-600">{wallet.userId?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ₹{wallet.balance.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone, or user code..."
              value={search}
              onChange={handleSearch}
              className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
            <i className="fas fa-search absolute right-4 top-3.5 text-gray-400"></i>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-wallet text-blue-600 text-lg"></i>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Wallets Table */}
        {!loading && !error && filteredWallets.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-6 py-4 text-left font-semibold">#</th>
                    <th className="px-6 py-4 text-left font-semibold">User Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Mobile</th>
                    <th className="px-6 py-4 text-left font-semibold">User Code</th>
                    <th className="px-6 py-4 text-right font-semibold">Balance</th>
                    <th className="px-6 py-4 text-left font-semibold">Transactions</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWallets.map((wallet, index) => (
                    <tr
                      key={wallet._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {wallet.userId?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wallet.userId?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wallet.userId?.mobileNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wallet.userId?.uniqueCode || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold">
                          ₹{wallet.balance.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {wallet.transactions?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {wallet.updatedAt
                          ? new Date(wallet.updatedAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, totalWallets)} of {totalWallets} wallets
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchWallets(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchWallets(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => fetchWallets(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredWallets.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <i className="fas fa-inbox text-gray-400 text-5xl mb-4 block"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Wallets Found</h3>
            <p className="text-gray-600">
              {search
                ? "No wallets match your search criteria."
                : "No user wallets available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
