import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HastalarClient from "./HastalarClient";
import { Card, CardContent } from "@/components/ui/card";
import { User, Activity, AlertTriangle, Plus } from "lucide-react";

export default async function HastalarPage() {
  // 🚀 VERİTABANI SORGULARI (Parallel Fetching)
  // Hem hasta listesini hem de toplam analiz sayısını aynı anda çekiyoruz.
  const [patients, totalAnalyses] = await Promise.all([
    prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { analyses: true },
        },
      },
    }),
    prisma.analysis.count(), // Toplam analiz sayısını tablodan saydırıyoruz
  ]);

  // ⚠️ YÜKSEK RİSK HESAPLAMA
  // Dashboard ile tutarlı olması için sadece "Severe" ve "Proliferative_DR" olanları sayıyoruz.
  // Eğer tüm hastalıkları saymak istersen filter'ı değiştirebiliriz.
  const highRiskCount = patients.filter((p) =>
    ["Severe", "Proliferative_DR"].includes(p.risk || "")
  ).length;

  return (
    <div className="relative p-6 space-y-8 min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/70 to-indigo-100/60">
      {/* 🌌 AI-TEMALI DYNAMIC GLOW */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue-Purple Gradient Glow */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-400 opacity-50 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>

        {/* Cyan-Pink Gradient Glow */}
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-300 opacity-40 blur-3xl animate-[pulse_5s_ease-in-out_infinite]"></div>

        {/* Purple-Pink Moving Glow */}
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-red-400 opacity-40 blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>

        {/* Pink-Cyan Floating Glow */}
        <div className="absolute top-20 left-1/3 h-64 w-64 rounded-full bg-gradient-to-t from-pink-400 via-purple-400 to-cyan-400 opacity-35 blur-3xl animate-[pulse_4.5s_ease-in-out_infinite]"></div>
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.035)_1px,transparent_0)] bg-[length:22px_22px]"></div>

      {/* 🔹 HEADER */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Hasta Yönetimi
          </h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <p className="mt-2 text-slate-600 font-medium">
            Sistemde kayıtlı portföy ve analiz durumları.
          </p>
        </div>

        <Button
          asChild
          className="
            bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
            shadow-lg shadow-blue-500/40 hover:opacity-90 hover:scale-105 transition-all
          "
        >
          <Link
            href="/dashboard/hastalar/yeni"
            className="flex items-center gap-2"
          >
            <Plus size={18} /> Yeni Hasta Kaydı
          </Link>
        </Button>
      </div>

      {/* 🔹 İSTATİSTİKLER (VERİTABANINDAN CANLI) */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 z-10">
        {/* Card 1: Toplam Hasta */}
        <StatCard
          title="Toplam Hasta"
          value={patients.length}
          icon={<User className="h-5 w-5" />}
          color="blue"
          subText="Aktif Kayıt"
        />

        {/* Card 2: Toplam Analizler (Düzeltildi) */}
        <StatCard
          title="Toplam Analizler"
          value={totalAnalyses}
          icon={<Activity className="h-5 w-5" />}
          color="emerald"
          subText="Tamamlanan İşlem"
        />

        {/* Card 3: Yüksek Riskli */}
        <StatCard
          title="Yüksek Riskli"
          value={highRiskCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
          subText="Acil İlgi Gereken"
        />
      </div>

      {/* 🔹 CLIENT LIST */}
      <div className="relative z-10">
        <Card className="border-none bg-white/80 backdrop-blur shadow-xl shadow-slate-300/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <HastalarClient patients={patients} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ✨ StatCard Bileşeni (Aynı tasarım korundu)
function StatCard({ title, value, icon, color, subText }: any) {
  const colors: any = {
    blue: "from-blue-500/20 to-cyan-500/20 text-blue-700 bg-blue-100/50",
    emerald:
      "from-emerald-500/20 to-teal-500/20 text-emerald-700 bg-emerald-100/50",
    red: "from-red-500/20 to-rose-500/20 text-red-700 bg-red-100/50",
  };

  const iconBg = {
    blue: "bg-blue-500 text-white",
    emerald: "bg-emerald-500 text-white",
    red: "bg-red-500 text-white",
  };

  return (
    <Card className="group relative border-none overflow-hidden bg-white/80 backdrop-blur shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <CardContent className="relative p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {value}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {subText}
            </span>
          </div>
        </div>

        <div
          className={`p-3 rounded-xl shadow-md ${
            iconBg[color as keyof typeof iconBg]
          } group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
