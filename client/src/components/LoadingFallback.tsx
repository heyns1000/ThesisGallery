import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingFallbackProps {
  message?: string;
  className?: string;
}

export function LoadingFallback({ 
  message = "Loading...", 
  className = "min-h-[400px]" 
}: LoadingFallbackProps) {
  return (
    <div className={`w-full flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground text-center">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoadingFallback;