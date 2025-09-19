import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/stats
export async function GET(request) {
  try {
    // Get admin cookies from the request
    const adminToken = request.cookies.get("adminToken")?.value;
    
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: "Admin authentication required" },
        { status: 401 }
      );
    }

    // Fetch petition statistics
    const petitionStatsResponse = await fetch(
      `${API_BASE_URL}/api/petitions/stats`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!petitionStatsResponse.ok) {
      throw new Error("Failed to fetch petition statistics");
    }

    const petitionStats = await petitionStatsResponse.json();

    // Fetch user statistics
    const usersResponse = await fetch(
      `${API_BASE_URL}/api/admin/customers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `adminToken=${adminToken}`,
        },
      }
    );

    let totalUsers = 0;
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      totalUsers = users.length;
    }

    // Calculate additional statistics
    const stats = {
      totalPetitions: petitionStats.totalPetitions || 0,
      totalSignatures: petitionStats.totalSignatures || 0,
      totalUsers: totalUsers,
      victories: petitionStats.victories || 0,
      recentActivity: petitionStats.recentActivity || 0,
      breakdown: petitionStats.breakdown || {
        activePetitions: 0,
        successfulPetitions: 0,
        activeSignatures: 0,
        successfulSignatures: 0,
      },
    };

    return NextResponse.json({
      success: true,
      stats,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
