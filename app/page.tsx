"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
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
  const [lastUpdate, setLastUpdate] = useState("");

  const [topKppn, setTopKppn] = useState<RankItem[]>([]);
  const [topKl, setTopKl] = useState<RankItem[]>([]);
  const [topUsulan, setTopUsulan] = useState<RankItem[]>([]);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total || 0);
        setSertifikasi(data.sertifikasi || 0);
        setBelum(data.belum || 0);

        setTopKppn(data.topKppn || []);
        setTopKl(data.topKl || []);
        setTopUsulan(data.topUsulan || []);

        const formatted = new Date(
          data.updatedAt
        ).toLocaleString("id-ID", {
          dateStyle: "long",
          timeStyle: "short",
        });

        setLastUpdate(formatted);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">
            DIREKTORAT SISTEM PERBENDAHARAAN
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-2">
            Dashboard Pejabat Perbendaharaan
          </h1>

          <p className="text-slate-500 mt-2">
            Monitoring sertifikasi pejabat perbendaharaan
          </p>
        </div>

        <div className="bg-white rounded-2xl px-5 py-4 shadow">
          <p className="text-xs text-slate-500 mb-1">
            Terakhir diperbarui
          </p>

          <p className="font-semibold text-slate-800">
            {lastUpdate} WIB
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <KpiCard
          title="Total Pejabat"
          value={total}
          subtitle="100% populasi data"
          icon={<Users size={22} />}
          color="from-slate-800 to-slate-700"
        />

        <KpiCard
          title="Tersertifikasi"
          value={sertifikasi}
          subtitle={`${
            total
              ? (
                  (sertifikasi / total) *
                  100
                ).toLocaleString("id-ID", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : "0,0"
          }% dari total pejabat`}
          icon={<BadgeCheck size={22} />}
          color="from-blue-600 to-blue-500"
        />

        <KpiCard
          title="Belum Sertifikasi"
          value={belum}
          subtitle={`${
            total
              ? (
                  (belum / total) *
                  100
                ).toLocaleString("id-ID", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              : "0,0"
          }% dari total pejabat`}
          icon={<AlertTriangle size={22} />}
          color="from-amber-500 to-orange-500"
        />

      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* CHART KIRI */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Breakdown Status Usulan
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Khusus pejabat belum tersertifikasi
          </p>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topUsulan}>
                <defs>
                  <linearGradient
                    id="orangeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f59e0b"
                    />
                    <stop
                      offset="100%"
                      stopColor="#f97316"
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="nama"
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={90}
                  fontSize={12}
                />

                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="jumlah"
                  radius={[10, 10, 0, 0]}
                  fill="url(#orangeGradient)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INSIGHT */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-4">
            Executive Insight
          </p>

          <h3 className="text-2xl font-bold mb-6">
            Prioritas Tindak Lanjut
          </h3>

          <div className="space-y-5 text-sm leading-relaxed">

            <div>
              <p className="font-semibold text-amber-400">
                Antrean Diklat
              </p>
              <p className="text-slate-300">
                Koordinasi dengan Pusdiklat AP untuk percepatan penjadwalan pelatihan.
              </p>
            </div>

            <div>
              <p className="font-semibold text-blue-400">
                Belum Rekam Usulan
              </p>
              <p className="text-slate-300">
                Percepatan pendaftaran melalui Biro Keuangan K/L dan KPPN/Kanwil.
              </p>
            </div>

            <div>
              <p className="font-semibold text-cyan-400">
                Dalam Verifikasi
              </p>
              <p className="text-slate-300">
                Percepatan proses verifikasi oleh Admin Satker dan KPPN.
              </p>
            </div>

            <div>
              <p className="font-semibold text-red-400">
                Sertifikat Kadaluarsa
              </p>
              <p className="text-slate-300">
                Pengajuan pendaftaran ulang sertifikasi.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-200">
                Tidak Direkomendasikan
              </p>
              <p className="text-slate-300">
                Merekomendasikan pejabat pengganti yang memenuhi persyaratan.
              </p>
            </div>

          </div>
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
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-gradient-to-r ${color} text-white rounded-3xl p-6 shadow hover:scale-[1.02] transition duration-300`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-wide opacity-80">
          {title}
        </p>

        <div className="opacity-90">
          {icon}
        </div>
      </div>

      <h2 className="text-5xl font-bold mt-4">
        {value.toLocaleString("id-ID")}
      </h2>

      {subtitle && (
        <p className="text-sm mt-3 opacity-90">
          {subtitle}
        </p>
      )}
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