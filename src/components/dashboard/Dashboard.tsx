import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign, Users, TrendingUp, MapPin } from "lucide-react";

const overviewMetrics = [
    { title: "Platform Revenue", value: "$234K", change: "Last 30 days", icon: DollarSign },
    { title: "Active Users", value: "2,340", change: "+127 this week", icon: Users },
    { title: "Avg. ROI", value: "287%", change: "User average", icon: TrendingUp },
    { title: "Your Cities", value: "0", change: "Tracked", icon: MapPin },
];

const successStories = [
    { name: "Marcus T.", city: "Dallas", revenue: "$4,200", comment: "The heatmap is a game-changer!" },
    { name: "David K.", city: "San Francisco", revenue: "$6,800", comment: "Nailed my pricing thanks to the AI." },
    { name: "Alex R.", city: "Miami", revenue: "$3,500", comment: "Found a new client base in South Beach." }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map(metric => (
            <Card key={metric.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.change}</p>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800/50">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-300 font-headline">💰 Success Stories</CardTitle>
          <CardDescription className="text-green-700 dark:text-green-400">See how others are succeeding with MasseurPro.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {successStories.map((story, i) => (
            <Card key={i} className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                {story.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{story.name}</p>
                            <p className="text-sm text-muted-foreground">{story.city}</p>
                        </div>
                    </div>
                </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{story.revenue}</p>
                <p className="text-sm text-muted-foreground italic mt-1">"{story.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
