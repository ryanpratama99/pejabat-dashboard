"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type RankItem = {
  nama: string;
  jumlah: number;
};

export default function Home() {
  const [total, setTotal] = useState(0);
  const [sertifikasi, setSertifikasi] = useState(0);
  const [belum, setBelum] = useState(0);

  const [topKppn, setTopKppn] = useState<RankItem[]>([]);
  const [topKl, setTopKl] = useState<RankItem[]>([]);

  useEffect(() => {
    fetch("/data.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data: any[] = XLSX.utils.sheet_to_json(sheet);

        setTotal(data.length);

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

        setSertifikasi(tersertifikasiData.length);
        setBelum(belumData.length);

        // TOP KPPN
        const groupKppn: Record<string, number> = {};

        belumData.forEach((row) => {
          const nama = String(row["NMKPPN"] || "").trim();
          if (!nama) return;

          groupKppn[nama] = (groupKppn[nama] || 0) + 1;
        });

        const rankingKppn = Object.entries(groupKppn)
          .map(([nama, jumlah]) => ({ nama, jumlah }))
          .sort((a, b) => b.jumlah - a.jumlah)
          .slice(0, 5);

        setTopKppn(rankingKppn);

        // TOP KL
        const groupKl: Record<string, number> = {};

        belumData.forEach((row) => {
          const nama = String(row["NAMA KL"] || "").trim();
          if (!nama) return;

          groupKl[nama] = (groupKl[nama] || 0) + 1;
        });

        const rankingKl = Object.entries(groupKl)
          .map(([nama, jumlah]) => ({ nama, jumlah }))
          .sort((a, b) => b.jumlah - a.jumlah)
          .slice(0, 5);

        setTopKl(rankingKl);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">
            pejabat-perbendaharaan.info
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">
            Dashboard Pejabat Perbendaharaan
          </h1>

          <p className="text-slate-500 mt-2">
            Monitoring nasional sertifikasi pejabat perbendaharaan
          </p>
        </div>

        <div className="bg-white rounded-2xl px-5 py-4 shadow">
          <p className="text-xs text-slate-500 mb-1">
            Terakhir diperbarui
          </p>

          <p className="font-semibold text-slate-800">
            {new Date().toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}{" "}
            WIB
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title="Total Pejabat"
          value={total}
          color="from-slate-800 to-slate-700"
        />

        <KpiCard
          title="Tersertifikasi"
          value={sertifikasi}
          color="from-blue-600 to-blue-500"
        />

        <KpiCard
          title="Belum Sertifikasi"
          value={belum}
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* CHART + INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Top 5 KPPN Belum Tersertifikasi
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topKppn}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nama" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="jumlah"
                  radius={[10, 10, 0, 0]}
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-3">
            Executive Insight
          </p>

          <h3 className="text-2xl font-bold leading-snug mb-4">
            {belum} pejabat belum tersertifikasi.
          </h3>

          <p className="text-slate-300 leading-relaxed">
            tempat buat fafifu di mari
          </p>
        </div>
      </div>

      {/* RANKING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RankingCard
          title="Top 5 KPPN Belum Tersertifikasi"
          data={topKppn}
        />

        <RankingCard
          title="Top 5 K/L Belum Tersertifikasi"
          data={topKl}
        />
      </div>
    </main>
  );
}

function KpiCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-3xl p-6 shadow`}
    >
      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="text-5xl font-bold mt-3">
        {value}
      </h2>
    </div>
  );
}

function RankingCard({
  title,
  data,
}: {
  title: string;
  data: RankItem[];
}) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <h2 className="text-xl font-bold text-slate-900 mb-4">
        {title}
      </h2>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              <span className="text-slate-800 font-medium">
                {item.nama}
              </span>
            </div>

            <span className="font-bold text-slate-900">
              {item.jumlah}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}