import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-3 py-2.5 border border-gray-300 rounded-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        "placeholder:text-gray-400 bg-white text-gray-900",
        "transition-colors duration-200",
        "disabled:bg-gray-100 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;