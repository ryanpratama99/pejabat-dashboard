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
import * as XLSX from "xlsx";

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
  const [kppnOptions, setKppnOptions] = useState<string[]>([]);
  const [klOptions, setKlOptions] = useState<string[]>([]);
  const [selectedKppn, setSelectedKppn] = useState("");
  const [selectedKl, setSelectedKl] = useState("");
  const [showKppnModal, setShowKppnModal] = useState(false);
  const [kppnDetail, setKppnDetail] = useState<any>(null);
  const [showKlModal, setShowKlModal] = useState(false);
  const [klDetail, setKlDetail] = useState<any>(null);

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
    fetch("/api/filter-options")
      .then((res) => res.json())
      .then((data) => {
        setKppnOptions(data.kppn || []);
        setKlOptions(data.kl || []);
      });
  }, []);

  const openKppnDetail = async (
  nama: string
    ) => {
  const res = await fetch(
    `/api/kppn-detail?nama=${encodeURIComponent(
      nama
    )}`
  );


  const data = await res.json();

  setKppnDetail(data);
  setShowKppnModal(true);
  };

  const openKlDetail = async (
  nama: string
) => {
  const res = await fetch(
    `/api/kl-detail?nama=${encodeURIComponent(
      nama
    )}`
  );

  const data = await res.json();

  setKlDetail(data);
  setShowKlModal(true);
};

const exportKlPrioritasExcel = () => {
  if (
    !klDetail ||
    !klDetail.prioritas
  )
    return;

  const rows =
    klDetail.prioritas.map(
      (item: any) => ({
        Nama: item.NAMA,
        Jabatan:
          item.NMJABATAN,
        Satker:
          item.NMSATKER,
        Status:
          item.STSUSULAN,
        "K/L":
          klDetail.nama,
        "Tanggal Download":
          new Date().toLocaleString(
            "id-ID"
          ),
      })
    );

  const ws =
    XLSX.utils.json_to_sheet(
      rows
    );

  const wb =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Prioritas KL"
  );

  XLSX.writeFile(
    wb,
    `Prioritas_${klDetail.nama}.xlsx`
  );
};

  const exportPrioritasExcel = () => {
  if (
    !kppnDetail ||
    !kppnDetail.prioritas
  )
    return;

  const rows =
    kppnDetail.prioritas.map(
      (item: any) => ({
        Nama: item.NAMA,
        Jabatan:
          item.NMJABATAN,
        Satker:
          item.NMSATKER,
        Status:
          item.STSUSULAN,
        KPPN:
          kppnDetail.nama,
        "Tanggal Download":
          new Date().toLocaleString(
            "id-ID"
          ),
      })
    );

  const ws =
    XLSX.utils.json_to_sheet(
      rows
    );

  const wb =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    ws,
    "Prioritas"
  );

  XLSX.writeFile(
    wb,
    `Prioritas_${kppnDetail.nama}.xlsx`
  );
};

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

  {/* KPPN */}
  <div className="bg-white rounded-3xl p-6 shadow">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="text-xl font-bold text-slate-900">
        Top 5 KPPN Belum Tersertifikasi
      </h2>

      <select
        value={selectedKppn}
        onChange={(e) => {
          const value = e.target.value;

          setSelectedKppn(value);

          if (value) {
            openKppnDetail(value);
          }
        }}
        className="border rounded-xl px-3 py-2 text-sm"
      >
        <option value="">
          Pilih KPPN
        </option>

        {kppnOptions.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>

    <div className="space-y-3">
      {topKppn.map((item, index) => (
        <div
          key={index}
          onClick={() =>
            openKppnDetail(item.nama)
          }
          className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
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

  {/* KL */}
  <div className="bg-white rounded-3xl p-6 shadow">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

  <h2 className="text-xl font-bold text-slate-900 leading-tight md:max-w-[45%]">
    Top 5 K/L Belum Tersertifikasi
  </h2>

  <select
    value={selectedKl}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedKl(value);

      if (value) {
        openKlDetail(value);
      }
    }}
    className="border rounded-xl px-3 py-2 text-sm w-full md:w-[55%]"
  >
    <option value="">
      Pilih K/L
    </option>

    {klOptions.map((item) => (
      <option
        key={item}
        value={item}
      >
        {item}
      </option>
    ))}
  </select>

</div>

    <div className="space-y-3">
      {topKl.map((item, index) => (
        <div
          key={index}
          onClick={() =>
            openKlDetail(item.nama)
          }
          className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
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

</div>

{showKppnModal && kppnDetail && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-auto">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">
            Profil Monitoring
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {kppnDetail.nama}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ringkasan kondisi sertifikasi pejabat perbendaharaan
          </p>
        </div>

        <button
          onClick={() => setShowKppnModal(false)}
          className="text-slate-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-slate-100 rounded-2xl p-4">
          <p className="text-xs text-slate-500">
            Total Pejabat
          </p>
          <p className="text-3xl font-bold">
            {kppnDetail.total}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-xs text-blue-600">
            Sudah Bersertifikat
          </p>
          <p className="text-3xl font-bold text-blue-700">
            {kppnDetail.sertifikasi}
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-xs text-orange-600">
            Belum Bersertifikat
          </p>
          <p className="text-3xl font-bold text-orange-700">
            {kppnDetail.belum}
          </p>
        </div>

      </div>

      {/* ACTION CENTER */}
      {(() => {
        const belumRekam =
          kppnDetail.usulan.find(
            (x: any) =>
              x.nama ===
              "Belum rekam usulan"
          )?.jumlah || 0;

        const kadaluarsa =
          kppnDetail.usulan.find(
            (x: any) =>
              x.nama ===
              "Sertifikat Kadaluarsa"
          )?.jumlah || 0;

        const totalAksi =
          belumRekam + kadaluarsa;

        return (
          <div className="mb-6">

            <p className="text-sm uppercase tracking-widest text-red-500 font-semibold mb-3">
              Fokus Percepatan Sertifikasi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-red-50 rounded-2xl p-4">
                <p className="text-xs text-red-600 uppercase font-semibold">
                  Belum Rekam Usulan
                </p>

                <p className="text-3xl font-bold text-red-700 mt-2">
                  {belumRekam}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Perlu segera melakukan perekaman usulan
                </p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-orange-600 uppercase font-semibold">
                  Sertifikat Kadaluarsa
                </p>

                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {kadaluarsa}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Prioritas pengajuan kembali sertifikasi
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-xs text-blue-600 uppercase font-semibold">
                  Prioritas Tindak Lanjut
                </p>

                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {totalAksi}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Belum rekam usulan + kadaluarsa
                </p>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Persentase */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">
          Tingkat Kepatuhan Sertifikasi
        </p>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{
              width: `${
                kppnDetail.total
                  ? (
                      (kppnDetail.sertifikasi /
                        kppnDetail.total) *
                      100
                    )
                  : 0
              }%`,
            }}
          />
        </div>

        <p className="text-sm mt-2 font-semibold text-slate-700">
          {kppnDetail.total
            ? (
                (kppnDetail.sertifikasi /
                  kppnDetail.total) *
                100
              ).toFixed(1)
            : "0"}
          %
        </p>
      </div>

      {/* PRIORITAS */}
<div className="mb-6">

  <div className="flex items-center justify-between gap-3 mb-3">

  <div>
    <h3 className="font-bold text-slate-900">
      Daftar Prioritas Tindak Lanjut
    </h3>

    <p className="text-sm text-slate-500">
      Maksimal 20 data prioritas
    </p>
  </div>

  <button
    onClick={
      exportPrioritasExcel
    }
    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
  >
    Export Excel
  </button>

</div>

  <p className="text-sm text-slate-500 mb-3">
    Daftar pejabat berikut memerlukan tindak lanjut percepatan sertifikasi.
  </p>

  {kppnDetail.prioritas &&
  kppnDetail.prioritas.length > 0 ? (

    <div className="overflow-hidden rounded-2xl border border-slate-200">

      <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 uppercase">

        <div className="col-span-3">
          Nama
        </div>

        <div className="col-span-3">
          Jabatan
        </div>

        <div className="col-span-4">
          Satker
        </div>

        <div className="col-span-2">
          Status
        </div>

      </div>

      <div className="divide-y divide-slate-100">

        {kppnDetail.prioritas.map(
          (item: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-slate-50"
            >
              <div className="col-span-3 font-medium text-slate-900">
                {item.NAMA}
              </div>

              <div className="col-span-3 text-slate-700">
                {item.NMJABATAN}
              </div>

              <div className="col-span-4 text-slate-700">
                {item.NMSATKER}
              </div>

              <div className="col-span-2">
                <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                  {item.STSUSULAN}
                </span>
              </div>
            </div>
          )
        )}

      </div>

    </div>

  ) : (

    <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-500">
      Tidak terdapat data prioritas tindak lanjut.
    </div>

  )}

</div>

    </div>
  </div>
)}
    {showKlModal && klDetail && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-auto">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">
            Profil Monitoring K/L
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {klDetail.nama}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ringkasan kondisi sertifikasi pejabat perbendaharaan
          </p>
        </div>

        <button
          onClick={() =>
            setShowKlModal(false)
          }
          className="text-slate-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-slate-100 rounded-2xl p-4">
          <p className="text-xs text-slate-500">
            Total Pejabat
          </p>
          <p className="text-3xl font-bold">
            {klDetail.total}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-xs text-blue-600">
            Sudah Bersertifikat
          </p>
          <p className="text-3xl font-bold text-blue-700">
            {klDetail.sertifikasi}
          </p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-4">
          <p className="text-xs text-orange-600">
            Belum Bersertifikat
          </p>
          <p className="text-3xl font-bold text-orange-700">
            {klDetail.belum}
          </p>
        </div>

      </div>

      {/* ACTION CENTER */}
      {(() => {
        const belumRekam =
          klDetail.usulan.find(
            (x: any) =>
              x.nama ===
              "Belum rekam usulan"
          )?.jumlah || 0;

        const kadaluarsa =
          klDetail.usulan.find(
            (x: any) =>
              x.nama ===
              "Sertifikat Kadaluarsa"
          )?.jumlah || 0;

        const totalAksi =
          belumRekam + kadaluarsa;

        return (
          <div className="mb-6">

            <p className="text-sm uppercase tracking-widest text-red-500 font-semibold mb-3">
              Fokus Percepatan Sertifikasi
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="bg-red-50 rounded-2xl p-4">
                <p className="text-xs text-red-600 uppercase font-semibold">
                  Belum Rekam Usulan
                </p>

                <p className="text-3xl font-bold text-red-700 mt-2">
                  {belumRekam}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Perlu segera melakukan perekaman usulan
                </p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs text-orange-600 uppercase font-semibold">
                  Sertifikat Kadaluarsa
                </p>

                <p className="text-3xl font-bold text-orange-700 mt-2">
                  {kadaluarsa}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Prioritas pengajuan kembali sertifikasi
                </p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-xs text-blue-600 uppercase font-semibold">
                  Prioritas Tindak Lanjut
                </p>

                <p className="text-3xl font-bold text-blue-700 mt-2">
                  {totalAksi}
                </p>

                <p className="text-sm text-slate-600 mt-2">
                  Belum rekam usulan + kadaluarsa
                </p>
              </div>

            </div>
          </div>
        );
      })()}

      {/* PERSENTASE */}
      <div className="mb-6">
        <p className="text-sm text-slate-500 mb-2">
          Tingkat Kepatuhan Sertifikasi
        </p>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{
              width: `${
                klDetail.total
                  ? (
                      (klDetail.sertifikasi /
                        klDetail.total) *
                      100
                    )
                  : 0
              }%`,
            }}
          />
        </div>

        <p className="text-sm mt-2 font-semibold text-slate-700">
          {klDetail.total
            ? (
                (klDetail.sertifikasi /
                  klDetail.total) *
                100
              ).toFixed(1)
            : "0"}
          %
        </p>
      </div>

      {/* PRIORITAS */}
      <div className="mb-6">

        <div className="flex items-center justify-between gap-3 mb-3">

  <div>
    <h3 className="font-bold text-slate-900">
      Daftar Prioritas Tindak Lanjut
    </h3>

    <p className="text-sm text-slate-500">
      Maksimal 20 data prioritas
    </p>
  </div>

  <button
    onClick={
      exportKlPrioritasExcel
    }
    className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
  >
    Export Excel
  </button>

</div>

        <p className="text-sm text-slate-500 mb-3">
          Daftar pejabat berikut memerlukan tindak lanjut percepatan sertifikasi.
        </p>

        {klDetail.prioritas &&
        klDetail.prioritas.length >
          0 ? (

          <div className="overflow-hidden rounded-2xl border border-slate-200">

            <div className="grid grid-cols-12 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 uppercase">

              <div className="col-span-3">
                Nama
              </div>

              <div className="col-span-3">
                Jabatan
              </div>

              <div className="col-span-4">
                Satker
              </div>

              <div className="col-span-2">
                Status
              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {klDetail.prioritas.map(
                (
                  item: any,
                  index: number
                ) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 px-4 py-3 text-sm hover:bg-slate-50"
                  >
                    <div className="col-span-3 font-medium text-slate-900">
                      {item.NAMA}
                    </div>

                    <div className="col-span-3 text-slate-700">
                      {item.NMJABATAN}
                    </div>

                    <div className="col-span-4 text-slate-700">
                      {item.NMSATKER}
                    </div>

                    <div className="col-span-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                        {item.STSUSULAN}
                      </span>
                    </div>
                  </div>
                )
              )}

            </div>
          </div>

        ) : (

          <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-500">
            Tidak terdapat data prioritas tindak lanjut.
          </div>

        )}

      </div>

    </div>
  </div>
)}
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