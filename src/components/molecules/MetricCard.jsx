import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className = "" 
}) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-gray-500";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };

  return (
    <Card className={`metric-card ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              <ApperIcon 
                name={getTrendIcon()} 
                className={`h-4 w-4 mr-1 ${getTrendColor()}`} 
              />
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
          <ApperIcon name={icon} className="h-8 w-8 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;