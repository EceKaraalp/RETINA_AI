"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Save,
  Moon,
} from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [includeDoctorNotes, setIncludeDoctorNotes] = useState(true);
  const [containImages, setContainImages] = useState(true);
  const [highResHeatmap, setHighResHeatmap] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [reportTitle, setReportTitle] = useState(
    "Dr. Ahmet Yılmaz - Retina Analiz Merkezi"
  );

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  const handleApplySettings = () => {
    // Bu kısımda backend veya localStorage kaydı ekleyebilirsin
    console.log({
      darkMode,
      includeDoctorNotes,
      containImages,
      highResHeatmap,
      criticalAlerts,
      reportTitle,
    });
    alert("Ayarlar kaydedildi!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sistem Ayarları</h1>
        <p className="text-muted-foreground">
          Uygulamanın mevcut çalışma düzenini özelleştirin.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Raporlama Ayarları */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <CardTitle>Raporlama Tercihleri</CardTitle>
              <CardDescription>
                Oluşturulan PDF raporlarının içeriğini belirleyin.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Rapor Başlığı (Klinik/Doktor Adı)</Label>
              <Input
                placeholder="Örn: Dr. Ahmet Yılmaz - Retina Analiz Merkezi"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
              />
              <p className="text-[10px] text-slate-400 italic">
                Bu metin PDF çıktısının en üstünde görünecektir.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Doktor Notlarını Dahil Et</Label>
                <p className="text-xs text-muted-foreground">
                  Yazdığınız manuel yorumları rapora ekler.
                </p>
              </div>
              <Switch
                checked={includeDoctorNotes}
                onCheckedChange={setIncludeDoctorNotes}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Ayarları */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <CardTitle>Panel Görünümü</CardTitle>
              <CardDescription>
                Dashboard üzerindeki bildirimleri ve temayı yönetin.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Gece Modu</Label>
                <p className="text-xs text-muted-foreground">
                  Dashboard ve raporlar için koyu tema uygular.
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          onClick={handleApplySettings}
        >
          <Save size={18} /> Ayarları Uygula
        </Button>
      </div>
    </div>
  );
}
