"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PanelLeft, Sparkles } from "lucide-react";
import { RetinaAiLogo } from "@/components/icons/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";
  const isPatientDetail = pathname.startsWith("/dashboard/hastalar/");

  return (
    <div className="
        relative min-h-screen
        p-8
        bg-gradient-to-br
        from-slate-100
        via-blue-50/70
        to-indigo-100/60
      "
      >
      <SidebarProvider defaultOpen>
        <Sidebar className="w-[280px] border-r border-white/5 shadow-2xl overflow-hidden bg-[#020617]">
          {/* 🌌 Arka Plan Katmanı - Opaklığı artırdık ve üzerine hafif bir siyah overlay ekledik */}
          <div className="absolute inset-0 animated-blue-gradient -z-10 opacity-100" />
          <div className="absolute inset-0 bg-black/20 -z-10" />{" "}
          {/* Yazıların okunması için ekstra karartma */}
          <SidebarHeader className="border-b border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 p-5 relative">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-500/30 rounded-full blur-md animate-pulse" />
                <RetinaAiLogo className="h-10 w-10 text-white relative drop-shadow-2xl" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tight text-white leading-none">
                  RETINA <span className="text-blue-400">AI</span>
                </h1>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-green-400 animate-ping" />
                  <span className="text-[9px] text-blue-200/70 font-bold tracking-[0.15em] uppercase">
                    Fundus Görüntü Analiz Sistemi
                  </span>
                </div>
              </div>
            </div>
          </SidebarHeader>
          {/* ... geri kalan içerik */}
          <SidebarContent className="px-3 py-6 custom-scrollbar">
            <SidebarNav />
          </SidebarContent>
          {/* Sidebar Alt Bilgi (Opsiyonel) */}
        </Sidebar>
        <SidebarInset className="flex flex-1 flex-col bg-slate-50">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200/60 bg-white/70 px-6 backdrop-blur-md">
            <SidebarTrigger className="rounded-full p-2 hover:bg-slate-200/50 transition-all active:scale-90">
              <PanelLeft className="h-5 w-5 text-slate-600" />
            </SidebarTrigger>

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            {isPatientDetail && (
              <Link
                href="/dashboard/hastalar"
                className="group flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition-all hover:border-blue-400 hover:text-blue-600 shadow-sm"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Hasta Listesi
              </Link>
            )}
          </header>

          <main className="flex-1 p-0">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
