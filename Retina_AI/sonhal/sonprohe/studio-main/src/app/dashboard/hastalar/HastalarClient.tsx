"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Calendar, ChevronRight, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ✅ Patient tipi ekledik
type Patient = {
  id: string;
  fullName: string;
  tcNo: string;
  createdAt: string;
  analyses?: {
    aiResult: string;
  }[];
};

export default function HastalarClient({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
      patient.tcNo.includes(search)
  );

  const getRiskStyle = (risk?: string) => {
    switch (risk) {
      case "Proliferative_DR":
      case "Severe":
        return {
          label: "YÜKSEK RİSK",
          className:
            "bg-red-500/10 text-red-600 border-red-200 shadow-sm shadow-red-100",
        };
      case "Moderate":
        return {
          label: "ORTA RİSK",
          className:
            "bg-orange-500/10 text-orange-600 border-orange-200 shadow-sm shadow-orange-100",
        };
      case "Mild":
        return {
          label: "DÜŞÜK RİSK",
          className:
            "bg-yellow-500/10 text-yellow-600 border-yellow-200 shadow-sm shadow-yellow-100",
        };
      case "No_DR":
        return {
          label: "SAĞLIKLI",
          className:
            "bg-emerald-500/10 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100",
        };
      default:
        return {
          label: "ANALİZ BEKLİYOR",
          className: "bg-slate-100 text-slate-500 border-slate-200",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Arama çubuğu */}
      <div className="relative group max-w-2xl mx-auto md:mx-0">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-white rounded-xl shadow-sm">
          <Search className="absolute left-4 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <Input
            placeholder="Hasta adı veya TC Kimlik No ile arama..."
            className="pl-12 h-14 border-none bg-transparent text-lg focus-visible:ring-0 placeholder:text-slate-400/80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="grid gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            
            console.log("PATIENT:", patient);

            const lastAnalysis = patient.analyses?.[0];
            const ai = lastAnalysis?.aiResult?.toLowerCase();

            let riskLabel = "ANALİZ BEKLİYOR";
            let riskClass =
              "bg-slate-100 text-slate-500 border-slate-200";

            if (ai) {
              if (ai.includes("mild") || ai.includes("hafif")) {
                riskLabel = "DÜŞÜK RİSK";
                riskClass = "bg-yellow-500/10 text-yellow-600 border-yellow-200";
              } else if (ai.includes("moderate") || ai.includes("orta")) {
                riskLabel = "ORTA RİSK";
                riskClass = "bg-orange-500/10 text-orange-600 border-orange-200";
              } else if (
                ai.includes("severe") ||
                ai.includes("proliferative") ||
                ai.includes("şiddetli")
              ) {
                riskLabel = "YÜKSEK RİSK";
                riskClass = "bg-red-500/10 text-red-600 border-red-200";
              }
            }


            return (
              <div
                key={patient.id}
                className="group relative flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-200/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Sol taraf: Avatar & Bilgi */}
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-bold text-xl">
                    {patient.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {patient.fullName}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 tracking-wider text-xs border border-slate-200">
                        {patient.tcNo}
                      </span>
                      <span className="hidden md:flex items-center gap-1 text-slate-400 text-xs">
                        <Calendar size={12} />
                        {new Date(patient.createdAt).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sağ taraf: Risk & Buton */}
                <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-end">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 text-xs font-bold tracking-wide ${riskClass}`}
                  >
                    {riskLabel}
                  </Badge>

                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  >
                    <Link
                      href={`/dashboard/hastalar/${patient.id}`}
                      className="flex items-center gap-1 px-4"
                    >
                      Detay <ChevronRight size={14} />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-400 h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-slate-600">
              Sonuç Bulunamadı
            </p>
            <p className="text-sm text-slate-400">
              Aradığınız kriterlere uygun hasta kaydı yok.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
