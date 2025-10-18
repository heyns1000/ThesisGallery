import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PodcastGallery } from "./components/PodcastGallery";
import { PodcastUploader } from "./components/PodcastUploader";
import { PodcastPlayer } from "./components/PodcastPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, Mic2, Radio } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

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

export function BushPortalHub() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Podcast | null>(null);

  const { data: podcasts = [], isLoading } = useQuery<Podcast[]>({
    queryKey: ['/api/podcasts'],
  });

  const handlePlay = async (podcast: Podcast) => {
    if (currentlyPlaying?.id === podcast.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(podcast);
      
      try {
        await apiRequest(`/api/podcasts/${podcast.id}/play`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to increment play count:', error);
      }
    }
  };

  const handleNext = () => {
    if (!currentlyPlaying || podcasts.length === 0) return;
    const currentIndex = podcasts.findIndex(p => p.id === currentlyPlaying.id);
    const nextIndex = (currentIndex + 1) % podcasts.length;
    handlePlay(podcasts[nextIndex]);
  };

  const handlePrevious = () => {
    if (!currentlyPlaying || podcasts.length === 0) return;
    const currentIndex = podcasts.findIndex(p => p.id === currentlyPlaying.id);
    const prevIndex = currentIndex === 0 ? podcasts.length - 1 : currentIndex - 1;
    handlePlay(podcasts[prevIndex]);
  };

  const totalPlays = podcasts.reduce((sum, p) => sum + (p.playCount || 0), 0);
  const totalDuration = podcasts.reduce((sum, p) => sum + (p.duration || 0), 0);
  const categories = new Set(podcasts.map(p => p.category).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pb-32">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-5xl">🎙️</span>
              <span className="bg-gradient-to-r from-[#00D4D4] to-purple-500 bg-clip-text text-transparent">
                Bush Portal
              </span>
            </h1>
            <p className="text-gray-400">
              Your hub for podcast management and ecosystem audio content
            </p>
          </div>
          <PodcastUploader />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-[#00D4D4]/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Podcasts</CardTitle>
              <Mic2 className="h-4 w-4 text-[#00D4D4]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{podcasts.length}</div>
              <p className="text-xs text-gray-500 mt-1">{categories} categories</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Plays</CardTitle>
              <Headphones className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalPlays}</div>
              <p className="text-xs text-gray-500 mt-1">Across all podcasts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Duration</CardTitle>
              <Radio className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
              </div>
              <p className="text-xs text-gray-500 mt-1">Of audio content</p>
            </CardContent>
          </Card>
        </div>

        {currentlyPlaying && (
          <Card className="mb-8 bg-gradient-to-r from-[#00D4D4]/10 to-purple-500/10 border-[#00D4D4]/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {currentlyPlaying.thumbnailUrl ? (
                    <img
                      src={currentlyPlaying.thumbnailUrl}
                      alt={currentlyPlaying.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#00D4D4]/20 flex items-center justify-center">
                      <Headphones className="h-8 w-8 text-[#00D4D4]" />
                    </div>
                  )}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00D4D4] rounded-full animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{currentlyPlaying.title}</div>
                  <div className="text-sm text-gray-400">Now Playing</div>
                </div>
                <div className="flex gap-2">
                  {currentlyPlaying.category && (
                    <Badge className="bg-[#00D4D4]/20 text-[#00D4D4] border-[#00D4D4]/30">
                      {currentlyPlaying.category}
                    </Badge>
                  )}
                  {currentlyPlaying.ecosystem && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {currentlyPlaying.ecosystem}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#00D4D4] border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading podcasts...</p>
          </div>
        ) : (
          <PodcastGallery
            podcasts={podcasts}
            onPlay={handlePlay}
            currentlyPlaying={currentlyPlaying}
          />
        )}

        {currentlyPlaying && (
          <PodcastPlayer
            audioUrl={currentlyPlaying.audioUrl}
            title={currentlyPlaying.title}
            onEnded={() => handleNext()}
            onNext={podcasts.length > 1 ? handleNext : undefined}
            onPrevious={podcasts.length > 1 ? handlePrevious : undefined}
          />
        )}
      </div>
    </div>
  );
}
