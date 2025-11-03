import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const goldFeatures = [
    "Demand Heatmap Access",
    "Basic Trip Planner",
    "AI Pricing Suggestions",
    "Basic Client CRM",
];

const platinumFeatures = [
    "All Gold Features",
    "Revenue & Expense Analytics",
    "Community Forum Access",
    "Real-time Google Trends",
    "AI-Generated Itineraries",
];

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline mb-2">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground">
          Unlock the full potential of MasseurPro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Gold</CardTitle>
            <CardDescription>For professionals getting started.</CardDescription>
            <p className="text-3xl font-bold pt-2">
              $49<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <ul className="space-y-2">
              {goldFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <div className="p-6 pt-0">
             <SubscriptionForm plan="gold" />
          </div>
        </Card>
        
        <Card className="border-primary flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Platinum</CardTitle>
             <CardDescription>For maximizing your business.</CardDescription>
            <p className="text-3xl font-bold pt-2">
              $99<span className="text-sm font-normal text-muted-foreground">/mo</span>
            p>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <ul className="space-y-2">
              {platinumFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
           <div className="p-6 pt-0">
             <SubscriptionForm plan="platinum" />
          </div>
        </Card>
      </div>
    </div>
  );
}
