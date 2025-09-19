import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// @desc    Get all comments for a petition (Admin)
// @route   GET /api/comments/petition/[petitionId]
export async function GET(request, { params }) {
  try {
    const { petitionId } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "50"; // Admin gets more comments per page

    if (!petitionId) {
      return NextResponse.json(
        { success: false, message: "Petition ID is required" },
        { status: 400 }
      );
    }

    // Get admin cookies from the request
    const adminToken = request.cookies.get("adminToken")?.value;
    
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Admin authentication required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/admin/petitions/${petitionId}/comments?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `adminToken=${adminToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch comments" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
