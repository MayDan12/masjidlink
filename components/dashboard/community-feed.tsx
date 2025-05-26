"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  MapPin,
  ImageIcon,
  Smile,
  Send,
} from "lucide-react";

type Post = {
  id: string;
  author: {
    name: string;
    role: string;
    image?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
  type: "announcement" | "event" | "general" | "question";
  attachments?: {
    type: "image" | "link";
    url: string;
  }[];
};

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState("all");
  const [newPostContent, setNewPostContent] = useState("");

  // Mock posts data
  const posts: Post[] = [
    {
      id: "1",
      author: {
        name: "Imam Abdullah",
        role: "Imam at Masjid Al-Noor",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Reminder: Jumu'ah prayer this Friday will be at 1:30 PM. The khutbah topic will be 'Strengthening Family Bonds in Islam.'",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
      likes: 24,
      comments: 5,
      isLiked: true,
      type: "announcement",
    },
    {
      id: "2",
      author: {
        name: "Sarah Ahmed",
        role: "Community Member",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Does anyone know if the weekend Islamic school is accepting new students for the upcoming semester?",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 5)),
      likes: 3,
      comments: 8,
      isLiked: false,
      type: "question",
    },
    {
      id: "3",
      author: {
        name: "Islamic Center",
        role: "Organization",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Join us this Saturday for our monthly community cleanup event! We'll be meeting at the masjid at 10 AM and heading to the local park. Bring gloves and water. Lunch will be provided.",
      timestamp: new Date(new Date().setHours(new Date().getHours() - 12)),
      likes: 45,
      comments: 12,
      isLiked: true,
      type: "event",
      attachments: [
        {
          type: "image",
          url: "/placeholder.svg?height=200&width=400",
        },
      ],
    },
    {
      id: "4",
      author: {
        name: "Mohammed Ali",
        role: "Youth Group Leader",
        image: "/placeholder.svg?height=40&width=40",
      },
      content:
        "The youth group had an amazing time at the retreat last weekend. Thank you to everyone who participated and helped organize!",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
      likes: 32,
      comments: 7,
      isLiked: false,
      type: "general",
      attachments: [
        {
          type: "image",
          url: "/placeholder.svg?height=200&width=400",
        },
      ],
    },
  ];

  // Filter posts based on active tab
  const filteredPosts =
    activeTab === "all"
      ? posts
      : posts.filter((post) => post.type === activeTab);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      console.log("New post:", newPostContent);
      setNewPostContent("");
      // In a real app, this would add the post to the feed
    }
  };

  const toggleLike = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggle like for post ${id}`);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="announcement">Announcements</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
          <TabsTrigger value="question">Questions</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <form onSubmit={handlePostSubmit}>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="Your profile"
                />
                <AvatarFallback>YP</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share something with the community..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="sr-only">Add Image</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Add Event</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MapPin className="h-4 w-4" />
                      <span className="sr-only">Add Location</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Smile className="h-4 w-4" />
                      <span className="sr-only">Add Emoji</span>
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newPostContent.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage
                      src={post.author.image || "/placeholder.svg"}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{post.author.name}</h4>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {post.author.role}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">
                            {formatTimestamp(post.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          post.type === "announcement"
                            ? "default"
                            : post.type === "event"
                            ? "secondary"
                            : post.type === "question"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {post.type === "announcement"
                          ? "Announcement"
                          : post.type === "event"
                          ? "Event"
                          : post.type === "question"
                          ? "Question"
                          : "Post"}
                      </Badge>
                    </div>
                    <p className="mt-2">{post.content}</p>
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="mt-3">
                        {post.attachments.map((attachment, index) => (
                          <div key={index} className="mt-2">
                            {attachment.type === "image" && (
                              <img
                                src={attachment.url || "/placeholder.svg"}
                                alt="Post attachment"
                                className="rounded-md max-h-[300px] w-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t flex justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        post.isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Posts Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no posts in this category at the moment.
            </p>
          </div>
        )}
      </div>

      {filteredPosts.length > 0 && (
        <div className="text-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}
