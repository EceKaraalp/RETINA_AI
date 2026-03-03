"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPatientAction(formData: {
  fullName: string;
  tcNo: string;
  age: number;
  gender: string;
  diabetesYears?: number | null;
  hba1c?: number | null;
}) {
  try {
    const patient = await prisma.patient.create({
      data: {
        fullName: formData.fullName,
        tcNo: formData.tcNo,
        age: formData.age,
        gender: formData.gender,
        diabetesYears: formData.diabetesYears,
        hba1c: formData.hba1c,
        risk: "Yok", // Şemandaki default değer
      },
    });

    revalidatePath("/dashboard/hastalar");
    return { success: true };
  } catch (error: any) {
    console.error("Kayıt Hatası:", error);
    return { success: false, error: "Hasta kaydedilemedi." };
  }
}
