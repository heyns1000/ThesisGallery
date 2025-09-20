import SamFoxGallery from "@/components/samfox-gallery";
import { getContent } from "@/lib/appData";

export default function GalleryPage() {
  const content = getContent('gallery');
  return (
    <div className="p-6 space-y-12">
      {/* Main SamFox Gallery */}
      <SamFoxGallery 
        title={content.title}
        showUpload={true}
        showFilter={true}
      />
      
      {/* Enhanced Music Experience Section with SamFox Styling */}
      <div className="bg-gradient-to-br from-orange-400/5 to-yellow-500/5 rounded-lg border border-orange-400/20 p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center mr-2">
            <i className="fab fa-spotify text-white text-sm"></i>
          </div>
          <span data-testid="text-audio-experience">{content.sections?.audio?.title || 'FAA™ Audio Experience'}</span>
        </h4>
        <p className="text-muted-foreground mb-4">
          <span data-testid="text-audio-description">{content.sections?.audio?.description || 'Enhance your Fruitful journey with curated musical elements designed for the Sacred Baobab™ ecosystem'}</span>
        </p>
        <div className="bg-card rounded-lg overflow-hidden border border-border/50">
          <iframe 
            data-testid="embed-iframe" 
            style={{ borderRadius: '8px' }} 
            src="https://open.spotify.com/embed/album/30OeYX8aVRKtwzyUS9D1kZ?utm_source=generator" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="w-full"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Synchronized with VaultMesh™ • Auto-curated for brand consistency
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">🎵 Active</span>
            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">SamFox Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
