import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Star, Repeat } from "lucide-react";

const crmData = [
  { title: "Total Clients", value: "42", icon: Users, color: "text-primary" },
  { title: "Repeat Rate", value: "73%", icon: Repeat, color: "text-green-600" },
  { title: "Avg. Rating", value: "4.7", icon: Star, color: "text-yellow-500" },
];

export default function ClientCrm() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crmData.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Future CRM Features</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This section is a placeholder for future client management features, such as a client database, appointment history, and communication tools.</p>
        </CardContent>
      </Card>
    </div>
  );
}
