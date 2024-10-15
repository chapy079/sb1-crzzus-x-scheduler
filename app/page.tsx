"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [post, setPost] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledPosts, setScheduledPosts] = useState<Array<{ post: string, date: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !scheduledDate) return;

    const response = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post, date: scheduledDate.toISOString() }),
    });

    if (response.ok) {
      setScheduledPosts([...scheduledPosts, { post, date: scheduledDate.toISOString() }]);
      setPost('');
      setScheduledDate(undefined);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">X Post Scheduler</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <Textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="What's happening?"
          className="mb-4"
        />
        <Calendar
          mode="single"
          selected={scheduledDate}
          onSelect={setScheduledDate}
          className="mb-4"
        />
        <Button type="submit">Schedule Post</Button>
      </form>
      <div>
        <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
        {scheduledPosts.map((scheduledPost, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle>Scheduled for {new Date(scheduledPost.date).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{scheduledPost.post}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}