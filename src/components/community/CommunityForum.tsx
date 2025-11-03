
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

const posts = [
  { author: "Mike", title: "Austin Pride Tips", replies: 23 },
  { author: "Sarah", title: "Best SF Neighborhoods for a week-long trip?", replies: 67 },
  { author: "Alex", title: "Tax Strategy Discussion for Traveling Masseurs", replies: 156 },
  { author: "Jordan", title: "Review: Miami vs. Fort Lauderdale Market", replies: 42 },
];

interface CommunityForumProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function CommunityForum({ userTier }: CommunityForumProps) {
  if (userTier !== 'platinum') {
      return (
        <Card className="text-center p-8">
          <CardTitle className="font-headline text-2xl">This is a Platinum Feature</CardTitle>
          <CardDescription className="my-4">
            Upgrade to the Platinum plan to access the exclusive community forum, connect with other professionals, and share insights.
          </CardDescription>
          <Link href="/subscribe">
            <Button>Upgrade to Platinum</Button>
          </Link>
        </Card>
      )
  }

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
