import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PatientDetailClient from "./patient-detail-client"; // Dosya yolunu kontrol et

export default async function HastaDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) notFound();

  const patient = await prisma.patient.findUnique({
    where: { id: id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!patient) notFound();

  return <PatientDetailClient patient={patient} />;
}
