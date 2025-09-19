"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessfulPetitionsPage() {
  const router = useRouter();
  const [successfulPetitions, setSuccessfulPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Categories from the model
  const categories = [
    'Environment', 
    'Education', 
    'Healthcare', 
    'Social Justice', 
    'Politics', 
    'Animal Rights', 
    'Human Rights',
    'Technology',
    'Other'
  ];

  // Fetch successful petitions from backend
  const fetchSuccessfulPetitions = async (page = 1, searchTerm = "", category = "", location = "", sort = "") => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category: category }),
        ...(location && { location: location }),
        ...(sort && { sort: sort }),
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/admin/successful-petitions?${queryParams}`,
        {
          credentials: "include", // Include admin cookies
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch successful petitions");
      }

      const data = await response.json();
      setSuccessfulPetitions(data.successfulPetitions);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalResults(data.pagination.totalResults);
    } catch (err) {
      setError("Failed to load successful petitions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete successful petition
  const handleDeleteSuccessfulPetition = async (petitionId, petitionTitle) => {
    if (!confirm(`Are you sure you want to delete "${petitionTitle}"?`)) {
      return;
    }

    try {
      setDeleteLoading(petitionId);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/admin/successful-petitions/${petitionId}`,
        {
          method: "DELETE",
          credentials: "include", // Include admin cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to delete successful petition");
      }

      // Refresh the successful petitions list
      await fetchSuccessfulPetitions(currentPage, search, selectedCategory, selectedLocation, sortBy);
      alert("Successful petition deleted successfully!");
    } catch (err) {
      alert("Failed to delete successful petition: " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle petition click to view details
  const handlePetitionClick = (petitionId) => {
    router.push(`/dashboard/successfulpetitions/${petitionId}`);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSuccessfulPetitions(1, search, selectedCategory, selectedLocation, sortBy);
  };

  // Handle category filter
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchSuccessfulPetitions(1, search, category, selectedLocation, sortBy);
  };

  // Handle location filter
  const handleLocationChange = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    setCurrentPage(1);
    fetchSuccessfulPetitions(1, search, selectedCategory, location, sortBy);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortBy(sort);
    setCurrentPage(1);
    fetchSuccessfulPetitions(1, search, selectedCategory, selectedLocation, sort);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique locations for filter
  const locations = [...new Set(successfulPetitions.map((p) => p.location))].sort();

  useEffect(() => {
    fetchSuccessfulPetitions();
  }, []);

  if (loading && successfulPetitions.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">Successful Petitions Management</h1>
          <p className="text-gray-600 font-medium">Manage and monitor all successful petitions</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-trophy text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">Successful Petitions Management</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl border border-green-200">
            <i className="fas fa-trophy text-green-600"></i>
            <span className="text-gray-700 font-medium">Total: {totalResults} successful petitions</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
              <i className="fas fa-search text-green-600 text-lg"></i>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Search & Filter</h3>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search successful petitions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>
              <div className="sm:w-48 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-tags text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                </div>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-48 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-map-marker-alt text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                </div>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-48 relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-sort text-gray-400 group-focus-within:text-orange-500 transition-colors"></i>
                </div>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                >
                  <option value="">Sort by Latest</option>
                  <option value="signatures">Sort by Signatures</option>
                  <option value="title">Sort by Title</option>
                  <option value="oldest">Sort by Oldest</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium flex items-center gap-2"
              >
                <i className="fas fa-search"></i>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-red-500 text-lg"></i>
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Successful Petitions Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-trophy text-green-500"></i>
                    Petition
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-tags text-purple-500"></i>
                    Category
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    Location
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-signature text-orange-500"></i>
                    Signatures
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user text-indigo-500"></i>
                    Starter
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar-check text-yellow-500"></i>
                    Success Date
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-cog text-red-500"></i>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {successfulPetitions.map((petition) => (
                <tr
                  key={petition._id}
                  className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 cursor-pointer transition-all duration-200"
                  onClick={() => handlePetitionClick(petition._id)}
                >
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {petition.petitionTitle}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {petition.issue.substring(0, 100)}...
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {petition.category ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200">
                        <i className="fas fa-tag mr-1"></i>
                        {petition.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Uncategorized</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200">
                      <i className="fas fa-map-marker-alt mr-1"></i>
                      {petition.location}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <i className="fas fa-signature text-orange-500 mr-2"></i>
                      <span className="font-semibold">{petition.totalSignatures.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {petition.petitionStarterName}
                    </div>
                    <div className="text-sm text-gray-500">
                      Started: {formatDate(petition.startedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(petition.successDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleDeleteSuccessfulPetition(petition._id, petition.petitionTitle);
                      }}
                      disabled={deleteLoading === petition._id}
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2 text-sm font-medium"
                    >
                      {deleteLoading === petition._id ? (
                        <>
                          <i className="fas fa-spinner animate-spin"></i>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-trash"></i>
                          Delete
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {successfulPetitions.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <i className="fas fa-trophy text-6xl text-gray-300 mb-4"></i>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur"></div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No successful petitions found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border border-gray-200/50 sm:px-8 rounded-2xl shadow-xl">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                fetchSuccessfulPetitions(prevPage, search, selectedCategory, selectedLocation, sortBy);
              }}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <i className="fas fa-chevron-left mr-2"></i>
              Previous
            </button>
            <button
              onClick={() => {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                fetchSuccessfulPetitions(nextPage, search, selectedCategory, selectedLocation, sortBy);
              }}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, totalResults)}
                </span>{" "}
                of <span className="font-medium">{totalResults}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => {
                    const prevPage = currentPage - 1;
                    setCurrentPage(prevPage);
                    fetchSuccessfulPetitions(prevPage, search, selectedCategory, selectedLocation, sortBy);
                  }}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          fetchSuccessfulPetitions(page, search, selectedCategory, selectedLocation, sortBy);
                        }}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                          page === currentPage
                            ? "z-10 bg-gradient-to-r from-green-50 to-green-100 border-green-500 text-green-600 shadow-md"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => {
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    fetchSuccessfulPetitions(nextPage, search, selectedCategory, selectedLocation, sortBy);
                  }}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
