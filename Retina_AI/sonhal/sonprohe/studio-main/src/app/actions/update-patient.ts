"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePatientAction(formData: FormData) {
  const id = formData.get("id") as string;

  const diabetesYearsRaw = formData.get("diabetesYears");
  const hba1cRaw = formData.get("hba1c");

  await prisma.patient.update({
    where: { id },
    data: {
      age: Number(formData.get("age")),

      diabetesYears: diabetesYearsRaw === "" ? null : Number(diabetesYearsRaw),

      hba1c: hba1cRaw === "" ? null : Number(hba1cRaw),
    },
  });
}
