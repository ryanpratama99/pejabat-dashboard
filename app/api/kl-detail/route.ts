import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const nama =
      req.nextUrl.searchParams.get("nama");

    if (!nama) {
      return NextResponse.json(
        {
          error:
            "Nama K/L wajib diisi",
        },
        { status: 400 }
      );
    }

    // KPI
    const { count: total } =
      await supabase
        .from("pejabat")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("NAMA_KL", nama);

    const {
      count: sertifikasi,
    } = await supabase
      .from("pejabat")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("NAMA_KL", nama)
      .eq(
        "STSCERT",
        "Tersertifikasi"
      );

    const { count: belum } =
      await supabase
        .from("pejabat")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("NAMA_KL", nama)
        .eq(
          "STSCERT",
          "Belum Tersertifikasi"
        );

    // Status Usulan
    const { data: usulanRaw } =
      await supabase
        .from("pejabat")
        .select("STSUSULAN")
        .eq("NAMA_KL", nama)
        .eq(
          "STSCERT",
          "Belum Tersertifikasi"
        );

    const group: Record<
      string,
      number
    > = {};

    usulanRaw?.forEach(
      (row: any) => {
        const key =
          row.STSUSULAN;
        if (!key) return;

        group[key] =
          (group[key] || 0) + 1;
      }
    );

    const usulan =
      Object.entries(group)
        .map(
          ([
            nama,
            jumlah,
          ]) => ({
            nama,
            jumlah,
          })
        )
        .sort(
          (a, b) =>
            b.jumlah - a.jumlah
        );

    // Prioritas
    const {
  data: prioritas,
} = await supabase
  .from("pejabat")
  .select(
    "NAMA, NIP, NMJABATAN, NMSATKER, STSCERT, STSUSULAN"
  )
  .eq("NAMA_KL", nama)
  .eq(
    "STSCERT",
    "Belum Tersertifikasi"
  );

    return NextResponse.json({
      nama,
      total: total || 0,
      sertifikasi:
        sertifikasi || 0,
      belum: belum || 0,
      usulan,
      prioritas:
        prioritas || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Terjadi kesalahan",
      },
      { status: 500 }
    );
  }
}