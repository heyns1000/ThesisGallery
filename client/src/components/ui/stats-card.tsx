import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBg: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  iconBg, 
  change, 
  changeType = "positive", 
  className 
}: StatsCardProps) {
  return (
    <div className={cn("bg-card rounded-lg p-6 border border-border glow-effect", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", iconBg)}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={cn(
            "text-sm",
            changeType === "positive" ? "text-accent" :
            changeType === "negative" ? "text-destructive" :
            "text-muted-foreground"
          )}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
