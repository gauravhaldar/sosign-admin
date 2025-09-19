"use client";

import React, { useState, useEffect, useCallback } from "react";

const AdminCommentsSection = ({ petitionId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch comments
  const fetchComments = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(
          `${apiUrl}/api/comments/petition/${petitionId}?page=${pageNum}&limit=50`
        );
        const data = await response.json();

        if (data.success) {
          if (append) {
            setComments((prev) => [...prev, ...(data.comments || [])]);
          } else {
            setComments(data.comments || []);
          }
          setHasMore(data.hasNextPage || false);
        } else {
          setError(data.message || "Failed to fetch comments");
        }
      } catch (err) {
        setError("Failed to fetch comments");
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    },
    [petitionId]
  );

  useEffect(() => {
    if (petitionId) {
      fetchComments();
    }
  }, [petitionId, fetchComments]);

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (
      !confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingComment(commentId);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include", // Include admin cookies
      });

      const data = await response.json();
      if (data.success) {
        // Remove the comment from the state
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
        alert("Comment deleted successfully!");
      } else {
        setError(data.message || "Failed to delete comment");
        alert("Failed to delete comment: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      setError("Failed to delete comment");
      alert("Failed to delete comment");
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingComment(null);
    }
  };

  // Load more comments
  const loadMoreComments = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchComments(nextPage, true);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
        <span className="text-sm text-gray-500">
          {(comments || []).length} comment
          {(comments || []).length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No comments yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {comment?.user?.name
                      ? comment.user.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {comment?.user?.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {comment?.user?.designation || "Citizen"} •{" "}
                      {formatDate(comment.createdAt)}
                      {comment.isEdited && (
                        <span className="text-gray-400 ml-1">(edited)</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={deletingComment === comment._id}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete comment"
                >
                  {deletingComment === comment._id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Comment Content */}
              <p className="text-gray-800 mb-3">{comment?.content || ""}</p>

              {/* Comment Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>👍</span>
                  <span>
                    {(comment?.likes || []).length} like
                    {(comment?.likes || []).length !== 1 ? "s" : ""}
                  </span>
                </div>
                {comment?.replies && comment.replies.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>
                      {comment.replies.length} repl
                      {comment.replies.length !== 1 ? "ies" : "y"}
                    </span>
                  </div>
                )}
              </div>

              {/* Replies */}
              {comment?.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-8 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {reply?.user?.name
                              ? reply.user.name.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">
                              {reply?.user?.name || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                              {reply.isEdited && (
                                <span className="text-gray-400 ml-1">
                                  (edited)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(reply._id)}
                          disabled={deletingComment === reply._id}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          title="Delete reply"
                        >
                          {deletingComment === reply._id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                          ) : (
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-800">
                        {reply?.content || ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && comments.length > 0 && (
          <div className="text-center pt-4">
            <button
              onClick={loadMoreComments}
              disabled={loading}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Comments"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentsSection;
