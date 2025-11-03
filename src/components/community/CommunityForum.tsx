import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const posts = [
  { author: "Mike", title: "Austin Pride Tips", replies: 23 },
  { author: "Sarah", title: "Best SF Neighborhoods for a week-long trip?", replies: 67 },
  { author: "Alex", title: "Tax Strategy Discussion for Traveling Masseurs", replies: 156 },
  { author: "Jordan", title: "Review: Miami vs. Fort Lauderdale Market", replies: 42 },
];

export default function CommunityForum() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {posts.map((post, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-headline">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>by <strong>{post.author}</strong></span>
                <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
