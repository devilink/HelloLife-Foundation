"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full py-4 rounded-2xl border-2 border-border text-foreground font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2"
    >
      <Share2 className="w-5 h-5" /> 
      {copied ? "Link Copied!" : "Share"}
    </button>
  );
}
