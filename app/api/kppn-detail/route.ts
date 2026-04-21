import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const nama =
    req.nextUrl.searchParams.get("nama");

  if (!nama) {
    return NextResponse.json({
      error: "Nama KPPN wajib",
    });
  }

  const cleanNama = nama
    .trim()
    .replace(/\s+/g, " ");

  const { count: total } =
    await supabase
      .from("pejabat")
      .select("*", {
        count: "exact",
        head: true,
      })
      .ilike("NMKPPN", `%${nama.trim()}%`);

  const { count: sertifikasi } =
    await supabase
      .from("pejabat")
      .select("*", {
        count: "exact",
        head: true,
      })
      .ilike("NMKPPN", `%${nama.trim()}%`)
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
      .ilike("NMKPPN", `%${nama.trim()}%`)
      .eq(
        "STSCERT",
        "Belum Tersertifikasi"
      );

  const { data: usulanRaw } =
    await supabase
      .from("pejabat")
      .select("STSUSULAN")
      .ilike("NMKPPN", `%${nama.trim()}%`)
      .eq(
        "STSCERT",
        "Belum Tersertifikasi"
      );

  const group: Record<
    string,
    number
  > = {};

  usulanRaw?.forEach((row: any) => {
    const key = row.STSUSULAN;
    if (!key) return;

    group[key] =
      (group[key] || 0) + 1;
  });

  const usulan = Object.entries(group)
    .map(([nama, jumlah]) => ({
      nama,
      jumlah,
    }))
    .sort((a, b) => b.jumlah - a.jumlah);
  const { data: prioritasRaw } =
  await supabase
    .from("pejabat")
    .select(
      "NAMA, NIP, NMJABATAN, NMSATKER, STSCERT, STSUSULAN"
    )
    .ilike("NMKPPN", `%${nama.trim()}%`)
    .eq(
      "STSCERT",
      "Belum Tersertifikasi"
    );

const prioritas =
  prioritasRaw || [];

 return NextResponse.json({
  nama,
  total: total || 0,
  sertifikasi: sertifikasi || 0,
  belum: belum || 0,
  usulan,
  prioritas,
});
}