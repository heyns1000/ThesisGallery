import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { PodcastCard } from "./PodcastCard";

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

interface PodcastGalleryProps {
  podcasts: Podcast[];
  onPlay: (podcast: Podcast) => void;
  currentlyPlaying?: Podcast | null;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-played", label: "Most Played" },
  { value: "duration-asc", label: "Shortest First" },
  { value: "duration-desc", label: "Longest First" },
];

export function PodcastGallery({ podcasts, onPlay, currentlyPlaying }: PodcastGalleryProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ecosystemFilter, setEcosystemFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = Array.from(new Set(podcasts.map(p => p.category).filter(Boolean))) as string[];
  const ecosystems = Array.from(new Set(podcasts.map(p => p.ecosystem).filter(Boolean))) as string[];

  const filteredAndSortedPodcasts = podcasts
    .filter(podcast => {
      const matchesSearch = !search || 
        podcast.title.toLowerCase().includes(search.toLowerCase()) ||
        podcast.description?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || podcast.category === categoryFilter;
      const matchesEcosystem = ecosystemFilter === "all" || podcast.ecosystem === ecosystemFilter;

      return matchesSearch && matchesCategory && matchesEcosystem;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "most-played":
          return (b.playCount || 0) - (a.playCount || 0);
        case "duration-asc":
          return (a.duration || 0) - (b.duration || 0);
        case "duration-desc":
          return (b.duration || 0) - (a.duration || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search podcasts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            data-testid="input-search-podcasts"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white" data-testid="select-filter-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} data-testid={`filter-category-${cat.toLowerCase()}`}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ecosystemFilter} onValueChange={setEcosystemFilter}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white" data-testid="select-filter-ecosystem">
              <SelectValue placeholder="Ecosystem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ecosystems</SelectItem>
              {ecosystems.map(eco => (
                <SelectItem key={eco} value={eco}>
                  {eco}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white" data-testid="select-sort-by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedPodcasts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No podcasts found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedPodcasts.map(podcast => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              onPlay={onPlay}
              isPlaying={currentlyPlaying?.id === podcast.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
