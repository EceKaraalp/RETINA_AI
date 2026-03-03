import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Geçmiş Kayıtlar</h1>
      <Card>
        <CardHeader>
          <CardTitle>Yakında Burada</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Tüm hastaların geçmiş muayene kayıtları ve analiz sonuçları bu
            sayfada görüntülenecektir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
