import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const podcastFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  ecosystem: z.string().optional(),
  tags: z.string().optional(),
});

type PodcastFormData = z.infer<typeof podcastFormSchema>;

const ECOSYSTEMS = [
  "BaobabTree Systems",
  "Global Systems",
  "Wildlife Protection",
  "Water Security",
  "FAA™",
  "Mining",
  "Agriculture",
  "Education",
  "Health"
];

const CATEGORIES = [
  "Technology",
  "Business",
  "Education",
  "Entertainment",
  "Wildlife",
  "Environment",
  "Culture",
  "Music",
  "News"
];

export function PodcastUploader() {
  const [open, setOpen] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<PodcastFormData>({
    resolver: zodResolver(podcastFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      ecosystem: "",
      tags: "",
    },
  });

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^audio\/(mp3|mpeg|wav|m4a|ogg)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, M4A, or OGG)",
          variant: "destructive",
        });
        return;
      }
      setAudioFile(file);
      
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.floor(audio.duration));
      };
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, or WebP)",
          variant: "destructive",
        });
        return;
      }
      setThumbnailFile(file);
    }
  };

  const onSubmit = async (data: PodcastFormData) => {
    if (!audioFile) {
      toast({
        title: "Audio file required",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      if (data.ecosystem) formData.append('ecosystem', data.ecosystem);
      if (audioDuration) formData.append('duration', audioDuration.toString());
      if (data.tags) {
        const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean);
        formData.append('tags', JSON.stringify(tagsArray));
      }

      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const response = await fetch('/api/podcasts', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(100);
      
      toast({
        title: "Success!",
        description: "Podcast uploaded successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/podcasts'] });
      
      form.reset();
      setAudioFile(null);
      setThumbnailFile(null);
      setAudioDuration(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload podcast",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white"
          data-testid="button-upload-podcast"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Podcast
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-[#00D4D4]/30" data-testid="dialog-upload-podcast">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Upload New Podcast</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-upload-podcast">
            <div className="space-y-2">
              <FormLabel className="text-white">Audio File *</FormLabel>
              <Input
                type="file"
                accept=".mp3,.wav,.m4a,.ogg,audio/*"
                onChange={handleAudioFileChange}
                disabled={isUploading}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-audio-file"
              />
              {audioFile && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <span>{audioFile.name}</span>
                  {audioDuration && <span>({Math.floor(audioDuration / 60)}:{(audioDuration % 60).toString().padStart(2, '0')})</span>}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setAudioFile(null);
                      setAudioDuration(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel className="text-white">Thumbnail Image (Optional)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                disabled={isUploading}
                className="bg-gray-800 border-gray-700 text-white"
                data-testid="input-thumbnail-file"
              />
              {thumbnailFile && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <span>{thumbnailFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setThumbnailFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter podcast title"
                      disabled={isUploading}
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-podcast-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter podcast description"
                      disabled={isUploading}
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-podcast-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isUploading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecosystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Ecosystem</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isUploading}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white" data-testid="select-ecosystem">
                          <SelectValue placeholder="Select ecosystem" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ECOSYSTEMS.map(eco => (
                          <SelectItem key={eco} value={eco}>{eco}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. wildlife, nature, conservation"
                      disabled={isUploading}
                      className="bg-gray-800 border-gray-700 text-white"
                      data-testid="input-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" data-testid="progress-upload" />
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isUploading}
                className="border-gray-700 text-white hover:bg-gray-800"
                data-testid="button-cancel-upload"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !audioFile}
                className="bg-[#00D4D4] hover:bg-[#00B8B8] text-white"
                data-testid="button-submit-upload"
              >
                {isUploading ? "Uploading..." : "Upload Podcast"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
