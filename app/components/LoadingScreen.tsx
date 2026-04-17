export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">

      <img
        src="/logo-dsp.png"
        alt="DSP"
        className="w-28 h-28 animate-pulse drop-shadow-xl"
      />

      <h2 className="mt-6 text-xl font-bold text-slate-800">
        Memuat Dashboard
      </h2>

      <div className="flex gap-1 mt-3">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.15s]"></span>
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.3s]"></span>
      </div>

      <p className="text-sm text-slate-500 mt-5">
        Direktorat Sistem Perbendaharaan
      </p>

    </div>
  );
}