import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-info/10 text-info border-info/20",
    stable: "bg-success/10 text-success border-success/20",
    monitoring: "bg-warning/10 text-warning border-warning/20",
    critical: "bg-error/10 text-error border-error/20",
    admitted: "bg-blue-50 text-blue-700 border-blue-200",
    discharged: "bg-gray-100 text-gray-700 border-gray-200",
    emergency: "bg-red-50 text-red-700 border-red-200"
  };
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;