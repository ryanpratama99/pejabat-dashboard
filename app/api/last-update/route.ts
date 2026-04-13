import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data.xlsx"
    );

    const stats = fs.statSync(filePath);

    return NextResponse.json({
      updatedAt: stats.mtime,
    });
  } catch (error) {
    return NextResponse.json(
      {
        updatedAt: new Date(),
        error: "File data.xlsx tidak ditemukan",
      },
      { status: 200 }
    );
  }
}