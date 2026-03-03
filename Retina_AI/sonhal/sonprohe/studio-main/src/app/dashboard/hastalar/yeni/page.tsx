"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, UserPlus } from "lucide-react";
import { createPatientAction } from "@/app/actions/create-patient";

export default function YeniHastaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await createPatientAction({
      fullName: formData.get("fullName") as string,
      tcNo: formData.get("tcNo") as string,
      age: Number(formData.get("age")),
      gender: gender,
      diabetesYears: formData.get("diabetesYears")
        ? Number(formData.get("diabetesYears"))
        : null,
      hba1c: formData.get("hba1c") ? Number(formData.get("hba1c")) : null,
    });

    if (result.success) {
      toast({ title: "Başarılı", description: "Hasta kaydı oluşturuldu." });
      router.push("/dashboard/hastalar");
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="gap-2 text-slate-500"
      >
        <ArrowLeft size={16} /> Geri Dön
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="text-blue-600" />
            <CardTitle>Yeni Hasta Kaydı</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input name="fullName" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>TC No</Label>
                <Input
                  name="tcNo"
                  required
                  inputMode="numeric"
                  maxLength={11}
                  pattern="[0-9]{11}"
                  placeholder=""
                  onInput={(e) => {
                    const input = e.currentTarget;
                    input.value = input.value.replace(/\D/g, "");
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Yaş</Label>
                <Input name="age" type="number" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cinsiyet</Label>
              <Select onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Erkek">Erkek</SelectItem>
                  <SelectItem value="Kadın">Kadın</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Diyabet Yılı (Opsiyonel)</Label>
                <Input
                  name="diabetesYears"
                  type="number"
                  placeholder="Örn: 5"
                />
              </div>
              <div className="space-y-2">
                <Label>HbA1c (Opsiyonel)</Label>
                <Input
                  name="hba1c"
                  type="number"
                  step="0.1"
                  placeholder="Örn: 6.5"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
