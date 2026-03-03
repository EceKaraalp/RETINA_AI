"use client";

import { useState } from "react";
import jsPDF from "jspdf";
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
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function PatientDetailClient({ patient }: { patient: any }) {
  const [activeTab, setActiveTab] = useState<"analysis" | "reports">(
    "analysis"
  );
  const [editOpen, setEditOpen] = useState(false);

  const getRiskInfo = (risk?: string) => {
    switch (risk) {
      case "Yüksek":
        return {
          label: "YÜKSEK RİSK",
          className: "bg-red-500/10 text-red-600 border-red-200",
        };
      case "Orta":
        return {
          label: "ORTA RİSK",
          className: "bg-orange-500/10 text-orange-600 border-orange-200",
        };
      case "Düşük":
        return {
          label: "DÜŞÜK RİSK",
          className: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
        };
      case "Yok":
        return {
          label: "SAĞLIKLI",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
        };
      default:
        return {
          label: "ANALİZ BEKLİYOR",
          className: "bg-slate-100 text-slate-500 border-slate-200",
        };
    }
  };


  const riskInfo = getRiskInfo(patient.risk);


  /* 🧾 PDF OLUŞTURMA */
  const downloadPDF = (r: any) => {
    const pdf = new jsPDF();

    pdf.setFontSize(14);
    pdf.text("AI Retina Analiz Raporu", 20, 20);

    pdf.setFontSize(10);
    pdf.text(`Hasta: ${patient.fullName}`, 20, 35);
    pdf.text(`TC: ${patient.tcNo}`, 20, 42);
    pdf.text(
      `Tarih: ${format(new Date(r.createdAt), "dd.MM.yyyy HH:mm")}`,
      20,
      49
    );

    pdf.line(20, 55, 190, 55);

    pdf.text(`AI Teşhisi: ${r.aiResult}`, 20, 65);
    pdf.text(`Güven: %${Math.round(r.confidence * 100)}`, 20, 72);

    if (r.doctorNote) {
      pdf.text("Doktor Yorumu:", 20, 85);
      pdf.text(r.doctorNote, 20, 92, { maxWidth: 170 });
    }

    pdf.save(`analiz-${patient.tcNo}-${r.id}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hasta Bilgisi */}
      <Card className="p-6 flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{patient.fullName}</h1>
          <p className="text-sm text-muted-foreground">
            TC: {patient.tcNo} | Yaş: {patient.age}
          </p>
          <div className="mt-2">
            <Badge
              variant="outline"
              className={`text-xs font-bold ${riskInfo.className}`}
            >
              {riskInfo.label}
            </Badge>
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setEditOpen(true)}
        >
          Bilgileri Güncelle{" "}
        </Button>
        <UpdatePatientDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          patient={patient}
        />
      </Card>

      {/* TAB */}
      <div className="flex gap-4">
        <Button
          className="
    bg-green-600 hover:bg-green-700 text-white
    transition-transform duration-150
    active:scale-110
  "
          variant={activeTab === "analysis" ? "default" : "outline"}
          onClick={() => setActiveTab("analysis")}
        >
          Yeni Analiz
        </Button>
        <Button
          className="
    bg-gray-600 hover:bg-gray-700 text-white
    transition-transform duration-150
    active:scale-110
  "
          variant={activeTab === "reports" ? "default" : "outline"}
          onClick={() => setActiveTab("reports")}
        >
          Geçmiş Raporlar
        </Button>
      </div>

      {/* CONTENT */}
      {activeTab === "analysis" ? (
        <ImageAnalysisCard patientId={patient.id} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Geçmiş Analizler</CardTitle>
            <CardDescription>{reports.length} kayıt bulundu</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>AI</TableHead>
                  <TableHead>Güven</TableHead>
                  <TableHead>Fundus</TableHead>
                  <TableHead>Heatmap</TableHead>
                  <TableHead>Doktor Yorumu</TableHead>
                  <TableHead>PDF</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {format(new Date(r.createdAt), "dd MMM yyyy", {
                        locale: tr,
                      })}
                    </TableCell>

                    <TableCell>
                      <Badge>{r.aiResult}</Badge>
                    </TableCell>

                    <TableCell>%{Math.round(r.confidence * 100)}</TableCell>

                    <TableCell>
                      {r.originalImage && (
                        <img
                          src={r.originalImage}
                          className="w-14 h-14 rounded border"
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      {r.heatmapUrl && (
                        <img
                          src={r.heatmapUrl}
                          className="w-14 h-14 rounded border"
                        />
                      )}
                    </TableCell>

                    <TableCell className="max-w-[200px] text-xs">
                      {r.doctorNote ?? "—"}
                    </TableCell>

                    <TableCell>
                      <Button size="sm" onClick={() => downloadPDF(r)}>
                        PDF İndir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
