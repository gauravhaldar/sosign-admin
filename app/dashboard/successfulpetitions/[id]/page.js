"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function SuccessfulPetitionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [successfulPetition, setSuccessfulPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch successful petition details
  const fetchSuccessfulPetition = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/admin/successful-petitions/${params.id}`,
        {
          credentials: "include", // Include admin cookies
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch successful petition details");
      }

      const data = await response.json();
      setSuccessfulPetition(data.successfulPetition);
    } catch (err) {
      setError("Failed to load successful petition: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Delete successful petition
  const handleDeleteSuccessfulPetition = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${successfulPetition.petitionTitle}"?`
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/admin/successful-petitions/${params.id}`,
        {
          method: "DELETE",
          credentials: "include", // Include admin cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to delete successful petition");
      }

      alert("Successful petition deleted successfully!");
      router.push("/dashboard/successfulpetitions");
    } catch (err) {
      alert("Failed to delete successful petition: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format simple date
  const formatSimpleDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (params.id) {
      fetchSuccessfulPetition();
    }
  }, [params.id, fetchSuccessfulPetition]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Successful Petition Details
          </h1>
          <p className="text-gray-600 font-medium">
            Loading petition information...
          </p>
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <i className="fas fa-exclamation-triangle text-red-500 text-lg"></i>
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!successfulPetition) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="relative inline-block">
            <i className="fas fa-trophy text-6xl text-gray-300 mb-4"></i>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Successful petition not found
          </h3>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-arrow-left"></i>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <i className="fas fa-arrow-left text-gray-700 text-lg"></i>
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Successful Petition Details
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-xl border border-gray-200">
                  <i className="fas fa-hashtag text-gray-500"></i>
                  <span className="text-gray-600 font-medium text-sm">
                    ID: {successfulPetition._id}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteSuccessfulPetition}
            disabled={deleteLoading}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 font-medium"
          >
            {deleteLoading ? (
              <>
                <i className="fas fa-spinner animate-spin"></i>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i>
                Delete Successful Petition
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <i className="fas fa-trophy text-green-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Basic Information
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {successfulPetition.petitionTitle}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-xl text-sm font-semibold border border-green-200 inline-flex items-center gap-2">
                      <i className="fas fa-map-marker-alt"></i>
                      {successfulPetition.location}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    {successfulPetition.category ? (
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-xl text-sm font-semibold border border-purple-200 inline-flex items-center gap-2">
                        <i className="fas fa-tag"></i>
                        {successfulPetition.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Uncategorized
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Signatures
                    </label>
                    <div className="flex items-center">
                      <i className="fas fa-signature text-orange-500 mr-3 text-lg"></i>
                      <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {successfulPetition.totalSignatures.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Success Date
                    </label>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-calendar-check text-green-500"></i>
                      <p className="text-gray-900 font-medium">
                        {formatSimpleDate(successfulPetition.successDate)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Started Date
                    </label>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-play text-blue-500"></i>
                      <p className="text-gray-900 font-medium">
                        {formatSimpleDate(successfulPetition.startedDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Created At
                    </label>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-calendar text-indigo-500"></i>
                      <p className="text-gray-900 font-medium">
                        {formatDate(successfulPetition.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <i className="fas fa-file-alt text-blue-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Issue Description
                </h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {successfulPetition.issue}
                </p>
              </div>
            </div>
          </div>

          {/* Outcome */}
          {successfulPetition.outcome && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/5 to-yellow-500/5 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <i className="fas fa-check-circle text-green-600 text-lg"></i>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Outcome
                  </h2>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {successfulPetition.outcome}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image */}
          {successfulPetition.image && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                    <i className="fas fa-image text-purple-600 text-lg"></i>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Image
                  </h2>
                </div>
                <Image
                  src={successfulPetition.image}
                  alt="Successful petition image"
                  width={800}
                  height={400}
                  className="max-w-full h-auto rounded-xl border border-gray-200 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Decision Makers */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <i className="fas fa-users text-orange-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Decision Makers
                </h2>
              </div>
              <div className="grid gap-4">
                {successfulPetition.decisionMakers.map((maker, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-user text-blue-500 mr-1"></i>
                          Name
                        </label>
                        <p className="text-gray-900 font-medium">
                          {maker.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-building text-green-500 mr-1"></i>
                          Organization
                        </label>
                        <p className="text-gray-900 font-medium">
                          {maker.organization || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-envelope text-purple-500 mr-1"></i>
                          Email
                        </label>
                        <p className="text-gray-900 font-medium">
                          {maker.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          <i className="fas fa-phone text-orange-500 mr-1"></i>
                          Phone
                        </label>
                        <p className="text-gray-900 font-medium">
                          {maker.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <i className="fas fa-chart-bar text-green-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Quick Stats
                </h2>
              </div>
              <div className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <i className="fas fa-signature text-green-500 text-2xl mb-2"></i>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    {successfulPetition.totalSignatures.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Total Signatures
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <i className="fas fa-clock text-blue-500 text-2xl mb-2"></i>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {Math.ceil(
                      (new Date(successfulPetition.successDate) -
                        new Date(successfulPetition.startedDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">
                    Days to Success
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <i className="fas fa-users text-purple-500 text-2xl mb-2"></i>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {successfulPetition.decisionMakers.length}
                  </div>
                  <div className="text-sm text-purple-700 font-medium">
                    Decision Makers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Petition Starter */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <i className="fas fa-user-circle text-orange-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Petition Starter
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    <i className="fas fa-user text-blue-500 mr-1"></i>
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {successfulPetition.petitionStarterName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Original Petition Link */}
          {successfulPetition.originalPetitionId && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                    <i className="fas fa-link text-indigo-600 text-lg"></i>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Original Petition
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      <i className="fas fa-hashtag text-indigo-500 mr-1"></i>
                      Petition ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                      {successfulPetition.originalPetitionId._id ||
                        successfulPetition.originalPetitionId}
                    </p>
                  </div>
                  {successfulPetition.originalPetitionId.title && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <i className="fas fa-file-alt text-blue-500 mr-1"></i>
                        Original Title
                      </label>
                      <p className="text-gray-900 font-medium">
                        {successfulPetition.originalPetitionId.title}
                      </p>
                    </div>
                  )}
                  {successfulPetition.originalPetitionId.numberOfSignatures && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        <i className="fas fa-signature text-green-500 mr-1"></i>
                        Original Signatures
                      </label>
                      <p className="text-gray-900 font-medium">
                        {successfulPetition.originalPetitionId.numberOfSignatures.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/petitions/${
                          successfulPetition.originalPetitionId._id ||
                          successfulPetition.originalPetitionId
                        }`
                      )
                    }
                    className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    View Original Petition
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <i className="fas fa-history text-purple-600 text-lg"></i>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Timeline
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-1 flex items-center justify-center">
                    <i className="fas fa-play text-white text-xs"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Petition Started
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatSimpleDate(successfulPetition.startedDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1 flex items-center justify-center">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Petition Succeeded
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatSimpleDate(successfulPetition.successDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex-shrink-0 w-4 h-4 bg-purple-500 rounded-full mt-1 flex items-center justify-center">
                    <i className="fas fa-database text-white text-xs"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Added to Database
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatSimpleDate(successfulPetition.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
