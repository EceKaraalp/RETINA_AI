import { prisma } from "@/lib/prisma";
import "@/app/globals.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const [totalPatients, totalAnalyses, highRiskPatients, recentPatients] =
    await Promise.all([
      prisma.patient.count(),
      prisma.analysis.count(),
      prisma.patient.findMany({
        where: { risk: { in: ["Severe", "Proliferative_DR"] } },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const highRiskCount = await prisma.patient.count({
    where: { risk: { in: ["Severe", "Proliferative_DR"] } },
  });

  return (
    <div
      className="
        relative p-6 space-y-10 overflow-hidden
        bg-gradient-to-br
        from-slate-100
        via-blue-50/70
        to-indigo-100/60
      "
    >
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

      {/* Header */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Klinik Özet
          </h1>
          <div className="mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          <p className="mt-3 text-slate-600 font-medium">
            Yapay zeka destekli klinik kontrol paneli
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="bg-white/80 backdrop-blur border-slate-200 shadow-md hover:bg-white"
          >
            <Link href="/dashboard/hastalar">
              <Users className="mr-2 h-4 w-4" /> Hastalar
            </Link>
          </Button>

          <Button
            asChild
            className="
              bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600
              shadow-lg shadow-blue-500/40 hover:opacity-90
            "
          >
            <Link href="/dashboard/hastalar/yeni">
              <UserPlus className="mr-2 h-4 w-4" /> Yeni Kayıt
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Toplam Hasta"
          value={totalPatients}
          icon={<Users className="h-5 w-5" />}
          color="blue"
          desc="Kayıtlı Portföy"
        />
        <StatsCard
          title="Yüksek Risk"
          value={highRiskCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
          desc="AI Flagged"
        />
        <StatsCard
          title="Toplam Analiz"
          value={totalAnalyses}
          icon={<Activity className="h-5 w-5" />}
          color="emerald"
          desc="AI Tanılama"
        />
        <StatsCard
          title="Sistem Durumu"
          value="Aktif"
          icon={<Clock className="h-5 w-5" />}
          color="slate"
          desc="Cloud Sync"
        />
      </div>

      <div className="relative grid gap-6 md:grid-cols-7">
        {/* Recent Patients */}
        <Card className="md:col-span-4 border-none bg-white/80 backdrop-blur shadow-xl shadow-slate-300/50">
          <CardHeader>
            <CardTitle>Son Kaydedilen Hastalar</CardTitle>
            <CardDescription>Sisteme yeni giriş yapan hastalar</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentPatients.map((patient) => (
              <div
                key={patient.id}
                className="
                  flex items-center justify-between
                  p-3 rounded-xl
                  hover:bg-blue-100/40 hover:translate-x-1
                  transition-all duration-200
                "
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold flex items-center justify-center shadow-md">
                    {patient.fullName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{patient.fullName}</p>
                    <p className="text-xs text-slate-500">{patient.tcNo}</p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/hastalar/${patient.id}`}>
                    İncele <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Critical */}
        <Card
          className="
            md:col-span-3 border-none
            bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800
            text-white shadow-xl shadow-red-600/30
            animate-[pulse_6s_ease-in-out_infinite]
          "
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Kritik Vakalar
            </CardTitle>
            <CardDescription className="text-slate-400">
              AI tarafından yüksek riskli olarak işaretlenenler
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {highRiskPatients.length > 0 ? (
              highRiskPatients.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/hastalar/${p.id}`}
                  className="
                    block p-3 rounded-lg
                    bg-white/5 hover:bg-white/10
                    transition border border-white/10
                  "
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{p.fullName}</span>
                    <Badge className="bg-red-500/25 text-red-400 border-none shadow shadow-red-500/40">
                      {p.risk}
                    </Badge>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">
                Şu an kritik vaka bulunmuyor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* Stats Card */
function StatsCard({ title, value, icon, color, desc }: any) {
  const colors: any = {
    blue: "from-blue-500/30 to-cyan-500/30 text-blue-700",
    red: "from-red-500/30 to-rose-500/30 text-red-700",
    emerald: "from-emerald-500/30 to-teal-500/30 text-emerald-700",
    slate: "from-slate-500/30 to-slate-700/30 text-slate-800",
  };

  return (
    <Card
      className="
        group relative border-none overflow-hidden
        bg-white/80 backdrop-blur
        shadow-xl shadow-slate-300/50
        hover:shadow-2xl hover:-translate-y-1
        transition-all
      "
    >
      {/* AI Shine */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${colors[color]}
                    opacity-0 group-hover:opacity-100
                    animate-[shine_2.5s_linear_infinite]`}
      />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]}
                        shadow-md group-hover:scale-110 group-hover:rotate-3
                        transition-transform duration-300`}
          >
            {icon}
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-400" />
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold">{value}</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {desc}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
