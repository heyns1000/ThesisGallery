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
    <div className={cn("card-enhanced rounded-lg p-6 border border-border glow-effect hover:scale-[1.02] transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground text-enhanced">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg shadow-lg", iconBg)}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      {change && (
        <div className="mt-4">
          <span className={cn(
            "text-sm font-semibold",
            changeType === "positive" ? "status-enhanced" :
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
