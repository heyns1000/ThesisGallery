import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface Podcast {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  duration?: number | null;
  audioUrl: string;
  thumbnailUrl?: string | null;
  ecosystem?: string | null;
  tags?: string[] | null;
  playCount?: number;
  createdAt?: Date;
}

interface PodcastCardProps {
  podcast: Podcast;
  onPlay: (podcast: Podcast) => void;
  isPlaying?: boolean;
}

export function PodcastCard({ podcast, onPlay, isPlaying }: PodcastCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#00D4D4]/20",
        "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 hover:border-[#00D4D4]",
        isPlaying && "ring-2 ring-[#00D4D4] shadow-lg shadow-[#00D4D4]/30 animate-pulse"
      )}
      onClick={() => onPlay(podcast)}
      data-testid={`card-podcast-${podcast.id}`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {podcast.thumbnailUrl ? (
            <img
              src={podcast.thumbnailUrl}
              alt={podcast.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00D4D4]/20 to-purple-500/20 flex items-center justify-center">
              <Headphones className="h-20 w-20 text-[#00D4D4]/50" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-[#00D4D4] flex items-center justify-center" data-testid={`button-play-podcast-${podcast.id}`}>
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
          </div>

          {podcast.duration && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white border-0" data-testid={`text-podcast-duration-${podcast.id}`}>
              {formatDuration(podcast.duration)}
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2 group-hover:text-[#00D4D4] transition-colors" data-testid={`text-podcast-title-${podcast.id}`}>
            {podcast.title}
          </h3>
          
          {podcast.description && (
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {podcast.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {podcast.category && (
              <Badge variant="outline" className="text-xs border-[#00D4D4]/50 text-[#00D4D4]" data-testid={`badge-podcast-category-${podcast.id}`}>
                {podcast.category}
              </Badge>
            )}
            {podcast.ecosystem && (
              <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-400">
                {podcast.ecosystem}
              </Badge>
            )}
          </div>

          {podcast.playCount !== undefined && (
            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <Play className="h-3 w-3" />
              <span>{podcast.playCount} plays</span>
            </div>
          )}

          {podcast.tags && podcast.tags.length > 0 && (
            <div className="mt-2 flex gap-1 flex-wrap">
              {podcast.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
