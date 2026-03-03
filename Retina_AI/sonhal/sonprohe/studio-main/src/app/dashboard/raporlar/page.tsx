"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageAnalysisCard } from "@/components/dashboard/image-analysis-card";
import { UpdatePatientDialog } from "@/components/dashboard/update-patient-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const getRiskColor = (risk?: string) => {
  switch (risk) {
    case "Proliferative_DR":
    case "Severe":
      return "bg-red-500 text-white";
    case "Moderate":
      return "bg-orange-500 text-white";
    case "Mild":
      return "bg-yellow-500 text-white";
    case "No_DR":
      return "bg-emerald-500 text-white";
    default:
      return "bg-slate-300 text-slate-700";
  }
};

export default function PatientDetailClient({ patient }: { patient: any }) {
  const [activeTab, setActiveTab] = useState<"analysis" | "reports">(
    "analysis"
  );
  const [editOpen, setEditOpen] = useState(false);

  // 🔴 HATA BURADAYDI → reports TANIMLANDI
  const reports = patient?.analyses ?? [];

  return (
    <div className="relative p-6 space-y-8 min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/70 to-indigo-100/60">
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-400/25 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse delay-500" />
        <div className="absolute top-20 left-1/3 h-64 w-64 rounded-full bg-pink-400/15 blur-3xl animate-pulse delay-[1200ms]" />
      </div>

      {/* HASTA BİLGİLERİ */}
      <Card className="p-6 flex items-start justify-between bg-white/80 backdrop-blur shadow-xl border-none rounded-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {patient.fullName}
            </h1>
            <Badge
              className={`${getRiskColor(
                patient.risk
              )} px-3 py-1 rounded-full text-sm font-bold shadow-md`}
            >
              {patient.risk || "Normal"}
            </Badge>
          </div>

          <div className="text-sm text-slate-500">
            TC: {patient.tcNo} | Yaş: {patient.age} | HbA1c:{" "}
            {patient.hba1c ?? "-"} | Diyabet: {patient.diabetesYears ?? "-"} yıl
          </div>
        </div>

        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300 py-2 px-5 rounded-xl"
          onClick={() => setEditOpen(true)}
        >
          Bilgileri Güncelle
        </Button>

        <UpdatePatientDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          patient={patient}
        />
      </Card>

      {/* TABLAR */}
      <div className="flex gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab("analysis")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "analysis"
              ? "bg-blue-500 text-white shadow-md"
              : "text-slate-600 hover:bg-blue-100"
          }`}
        >
          Yeni Analiz
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === "reports"
              ? "bg-blue-500 text-white shadow-md"
              : "text-slate-600 hover:bg-blue-100"
          }`}
        >
          Geçmiş Raporlar
        </button>
      </div>

      {/* İÇERİK */}
      {activeTab === "analysis" ? (
        <ImageAnalysisCard patientId={patient.id} />
      ) : (
        <Card className="bg-white/80 backdrop-blur shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle>Geçmiş Analiz Listesi</CardTitle>
            <CardDescription>
              Toplam {reports.length} analiz kaydı bulundu.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>AI Teşhisi</TableHead>
                  <TableHead>Güven</TableHead>
                  <TableHead>Doktor Onayı</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.map((report: any) => (
                  <TableRow key={report.id}>
                    <TableCell className="text-xs">
                      {format(
                        new Date(report.createdAt),
                        "dd MMMM yyyy HH:mm",
                        {
                          locale: tr,
                        }
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge>{report.aiResult}</Badge>
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      %{Math.round(report.confidence * 100)}
                    </TableCell>

                    <TableCell>
                      {report.isCorrect === true ? (
                        <span className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle size={14} /> Onaylandı
                        </span>
                      ) : report.isCorrect === false ? (
                        <span className="flex items-center gap-1 text-red-500 text-xs">
                          <XCircle size={14} /> Düzeltildi
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500 text-xs">
                          <Clock size={14} /> Bekliyor
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <button className="p-2 hover:bg-accent rounded-full">
                        <Eye size={18} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}

                {reports.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground italic"
                    >
                      Henüz yapılmış bir analiz bulunmuyor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
