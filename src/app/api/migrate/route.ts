import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development or with a secret token
    const authHeader = request.headers.get("authorization");
    const secretToken = process.env.MIGRATE_SECRET_TOKEN;
    
    if (process.env.NODE_ENV === "production" && (!secretToken || authHeader !== `Bearer ${secretToken}`)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔄 Starting database migration...");

    try {
      const { stdout, stderr } = await execAsync("npx prisma migrate deploy");
      
      return NextResponse.json({
        success: true,
        message: "Migrations deployed successfully",
        output: stdout,
        errors: stderr || null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Migration error:", errorMessage);
      
      return NextResponse.json(
        {
          success: false,
          error: "Migration failed",
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error running migration:", error);
    return NextResponse.json(
      { error: "Failed to run migration", details: String(error) },
      { status: 500 }
    );
  }
}

