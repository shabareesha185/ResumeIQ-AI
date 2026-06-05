import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsCard({ title, value }) {
  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm text-zinc-500">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <h2 className="text-4xl font-bold">{value}</h2>
      </CardContent>
    </Card>
  );
}
