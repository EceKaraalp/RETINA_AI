"use server";

import { prisma } from "@/lib/prisma";

export async function updatePatientRisk(patientId: string, risk: string) {
  await prisma.patient.update({
    where: { id: patientId },
    data: { risk },
  });
}
