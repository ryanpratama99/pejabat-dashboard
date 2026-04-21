import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // KPI
    const { count: total } = await supabase
      .from("pejabat")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: sertifikasi } =
      await supabase
        .from("pejabat")
        .select("*", {
          count: "exact",
          head: true,
        })
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
        .eq(
          "STSCERT",
          "Belum Tersertifikasi"
        );

    // RANKING RPC
    const { data: topKppn } =
      await supabase.rpc("top_kppn");

    const { data: topKl } =
      await supabase.rpc("top_kl");

    const { data: topUsulan } =
      await supabase.rpc("top_usulan");

    return NextResponse.json({
      total: total || 0,
      sertifikasi: sertifikasi || 0,
      belum: belum || 0,
      topKppn: topKppn || [],
      topKl: topKl || [],
      topUsulan: topUsulan || [],
      updatedAt: new Date(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message ||
          "Database error",
      },
      { status: 500 }
    );
  }
}