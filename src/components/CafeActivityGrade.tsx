import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Activity } from "lucide-react";

interface CafeActivityGradeProps {
  activityLevel: string;
  activityScore?: number;
  size?: "sm" | "md" | "lg";
}

const getGradeConfig = (level: string) => {
  switch (level) {
    case "매우 높음":
      return {
        grade: "S",
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        textColor: "text-white",
        icon: Zap,
        description: "최상위 활성도"
      };
    case "높음":
      return {
        grade: "A",
        color: "bg-gradient-to-r from-emerald-500 to-teal-500",
        textColor: "text-white",
        icon: TrendingUp,
        description: "높은 활성도"
      };
    case "보통":
      return {
        grade: "B",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textColor: "text-white",
        icon: Activity,
        description: "보통 활성도"
      };
    case "낮음":
      return {
        grade: "C",
        color: "bg-gradient-to-r from-slate-400 to-slate-500",
        textColor: "text-white",
        icon: Activity,
        description: "낮은 활성도"
      };
    default:
      return {
        grade: "B",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textColor: "text-white",
        icon: Activity,
        description: "보통 활성도"
      };
  }
};

export const CafeActivityGrade = ({ 
  activityLevel, 
  activityScore = 0,
  size = "md" 
}: CafeActivityGradeProps) => {
  const config = getGradeConfig(activityLevel);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${config.color} 
          ${config.textColor}
          rounded-lg flex items-center justify-center font-bold
          shadow-lg relative overflow-hidden
        `}
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <span className="relative z-10">{config.grade}</span>
      </div>
      {size !== "sm" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Icon className={iconSizes[size]} />
            <span className="text-sm font-semibold">{config.description}</span>
          </div>
          {activityScore > 0 && (
            <span className="text-xs text-muted-foreground">
              활성도 점수: {activityScore}/100
            </span>
          )}
        </div>
      )}
    </div>
  );
};
