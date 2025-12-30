import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * One-time database setup endpoint
 * Visit this endpoint after deployment to create all database tables
 *
 * GET /api/setup-db
 */
export async function GET() {
  try {
    console.log("Starting database initialization...");

    // Run prisma db push to create tables
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss --skip-generate");

    console.log("Database push stdout:", stdout);
    if (stderr) {
      console.log("Database push stderr:", stderr);
    }

    return NextResponse.json({
      success: true,
      message: "Database tables created successfully!",
      output: stdout,
    });
  } catch (error: any) {
    console.error("Database setup error:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to initialize database",
      details: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
    }, { status: 500 });
  }
}
