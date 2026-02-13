"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/admin/wallets`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setWallets(data.wallets || []);
        } else {
          setError("Failed to fetch wallet information");
        }
      } catch (err) {
        console.error("Error fetching wallets:", err);
        setError("An error occurred while fetching wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  const filteredWallets = wallets.filter((wallet) =>
    wallet.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">User Wallets</h1>
        <p className="text-gray-600">View and manage user wallet point balances (₹5 = 1 Point)</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100 italic">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
          Total Users: <span className="text-blue-600 font-bold">{wallets.length}</span>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Points Balance</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Approx Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                    No users found matches your search
                  </td>
                </tr>
              ) : (
                filteredWallets.map((wallet) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={wallet._id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold uppercase text-sm border-2 border-white shadow-sm">
                          {wallet.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-gray-900">{wallet.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{wallet.email}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm">
                        {wallet.balance.toFixed(1)} Pts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-500">
                      ₹{(wallet.balance * 5).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
