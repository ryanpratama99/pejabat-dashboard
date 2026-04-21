import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: kppnRaw } =
    await supabase.rpc("list_kppn");

  const { data: klRaw } =
    await supabase.rpc("list_kl");

  return NextResponse.json({
    kppn:
      kppnRaw?.map((x: any) => x.nama) || [],
    kl:
      klRaw?.map((x: any) => x.nama) || [],
  });
}