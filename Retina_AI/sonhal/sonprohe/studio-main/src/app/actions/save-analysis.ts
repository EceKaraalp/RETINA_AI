"use server";

import { prisma } from "@/lib/prisma";
import { updatePatientRisk } from "./update-patient-risk";

/* 🔹 1️⃣ APTOS sonucu → Patient Risk çevirici */
function mapAiResultToRisk(
  aiResult: string
): "Yok" | "Düşük" | "Orta" | "Yüksek" {
  switch (aiResult) {
    case "No_DR":
      return "Yok";
    case "Mild":
      return "Düşük";
    case "Moderate":
      return "Orta";
    case "Severe":
    case "Proliferative_DR":
      return "Yüksek";
    default:
      return "Yok";
  }
}

export async function saveAnalysisAction({
  patientId,
  aiResult,
  confidence,
  heatmapUrl,
  originalImage,
  doctorNote,
  aiOdriLabels,
  aiOdriConfidences,
}: {
  patientId: string;
  aiResult: string;
  confidence: number;
  heatmapUrl?: string;
  originalImage?: string;
  doctorNote?: string;
  aiOdriLabels?: string[];
  aiOdriConfidences?: number[];
}) {
  try {
    await prisma.analysis.create({
      data: {
        patientId,
        aiResult,
        confidence,
        heatmapUrl,
        originalImage,
        doctorNote,
        aiOdriLabels: aiOdriLabels ? JSON.stringify(aiOdriLabels) : null,
        aiOdriConfidences: aiOdriConfidences
          ? JSON.stringify(aiOdriConfidences)
          : null,
      },
    });

     // ✅ Risk hesapla
    const risk = mapAiResultToRisk(aiResult);

    // ✅ Patient tablosunu güncelle
    await prisma.patient.update({
      where: { id: patientId },
      data: { risk },
    });

    await updatePatientRisk(patientId, risk);

    return { success: true };
  } catch (error) {
    console.error("saveAnalysisAction error:", error);
    return { success: false };
  }
}
