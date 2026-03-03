"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalysisReports() {
  try {
    const reports = await prisma.analysis.findMany({
      include: {
        patient: {
          select: {
            fullName: true,
            tcNo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // En yeni analiz en üstte
      },
    });
    return { success: true, data: reports };
  } catch (error) {
    return { success: false, error: "Raporlar yüklenemedi." };
  }
}
