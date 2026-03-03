import { ImageAnalysisCard } from '@/components/dashboard/image-analysis-card';

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Görsel Yükle &amp; Analiz
      </h1>
      <div className="mx-auto w-full max-w-2xl">
        <ImageAnalysisCard />
      </div>
    </div>
  );
}
