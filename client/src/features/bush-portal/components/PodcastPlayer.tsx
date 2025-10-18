import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface PodcastPlayerProps {
  audioUrl: string;
  title: string;
  onEnded?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function PodcastPlayer({ audioUrl, title, onEnded, onNext, onPrevious }: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const changeSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    audio.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t-2 border-[#00D4D4] shadow-lg shadow-[#00D4D4]/20" data-testid="player-container">
      <div className="container mx-auto px-4 py-3">
        <audio ref={audioRef} src={audioUrl} />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {onPrevious && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-white hover:text-[#00D4D4]"
                data-testid="button-previous"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className={cn(
                "h-12 w-12 rounded-full text-white hover:text-[#00D4D4]",
                isPlaying && "animate-pulse bg-[#00D4D4]/10"
              )}
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>

            {onNext && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-white hover:text-[#00D4D4]"
                data-testid="button-next"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex-1">
            <div className="text-sm text-white font-medium mb-1 truncate">{title}</div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 min-w-[40px]" data-testid="text-current-time">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
                data-testid="slider-progress"
              />
              <span className="text-xs text-gray-400 min-w-[40px]" data-testid="text-total-duration">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={changeSpeed}
              className="text-xs text-white hover:text-[#00D4D4] min-w-[50px]"
              data-testid="select-speed"
            >
              {playbackSpeed}x
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:text-[#00D4D4]"
                data-testid="button-mute"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
                data-testid="slider-volume"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
