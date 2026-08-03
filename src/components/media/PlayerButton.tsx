"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Play } from "lucide-react";

interface PlayerButtonProps {
  mediaType: string;
  mediaId: string | number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function PlayerButton({
  mediaType,
  mediaId,
  onClick,
  disabled,
}: PlayerButtonProps) {
  const router = useRouter();

  const handleplay = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/player/${mediaType}/${mediaId}`);
    }
  };

  return (
    <Button variant="primary" onClick={handleplay} disabled={disabled}>
      <Play className="w-5 h-5 fill-current" />
      Play Trailer
    </Button>
  );
}
