import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data.xlsx"
    );

    const fileBuffer = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileBuffer, {
      type: "buffer",
    });

    const sheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const data: any[] =
      XLSX.utils.sheet_to_json(sheet);

    const total = data.length;

    const tersertifikasiData = data.filter(
      (row) =>
        String(row["STSCERT"]).trim() ===
        "Tersertifikasi"
    );

    const belumData = data.filter(
      (row) =>
        String(row["STSCERT"]).trim() ===
        "Belum Tersertifikasi"
    );

    const sertifikasi =
      tersertifikasiData.length;

    const belum = belumData.length;

    // TOP KPPN
    const groupKppn: Record<string, number> =
      {};

    belumData.forEach((row) => {
      const nama = String(
        row["NMKPPN"] || ""
      ).trim();

      if (!nama) return;

      groupKppn[nama] =
        (groupKppn[nama] || 0) + 1;
    });

    const topKppn = Object.entries(groupKppn)
      .map(([nama, jumlah]) => ({
        nama,
        jumlah,
      }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);

    // TOP KL
    const groupKl: Record<string, number> = {};

    belumData.forEach((row) => {
      const nama = String(
        row["NAMA KL"] || ""
      ).trim();

      if (!nama) return;

      groupKl[nama] =
        (groupKl[nama] || 0) + 1;
    });

    const topKl = Object.entries(groupKl)
      .map(([nama, jumlah]) => ({
        nama,
        jumlah,
      }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);

    // STATUS USULAN
    const groupUsulan: Record<
      string,
      number
    > = {};

    belumData.forEach((row) => {
      const nama = String(
        row["STSUSULAN"] || ""
      ).trim();

      if (!nama) return;

      groupUsulan[nama] =
        (groupUsulan[nama] || 0) + 1;
    });

    const topUsulan = Object.entries(
      groupUsulan
    )
      .map(([nama, jumlah]) => ({
        nama,
        jumlah,
      }))
      .sort((a, b) => b.jumlah - a.jumlah);

    return NextResponse.json({
      total,
      sertifikasi,
      belum,
      topKppn,
      topKl,
      topUsulan,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}