"use client";

import { Button } from "@/components/ui/button";
import PostTweetSVG from "./SVGs/PostTweetIconSVG";

export default function TweetButton() {
  const handleTweet = () => {
    window.open("https://twitter.com/intent/tweet", "_blank");
  };

  return (
    <Button
      onClick={handleTweet}
      className="w-full rounded-full px-4 py-6 cursor-pointer"
      aria-label="Share on Twitter"
    >
      <PostTweetSVG className="size-6" color="currentColor" />
      <span className="hidden lg:inline">Tweet</span>
    </Button>
  );
}
