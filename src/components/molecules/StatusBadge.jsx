import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, showIcon = true }) => {
  const getStatusConfig = (status) => {
    const configs = {
      // Patient Status
      "Admitted": { variant: "admitted", icon: "UserCheck", text: "Admitted" },
      "Discharged": { variant: "discharged", icon: "UserX", text: "Discharged" },
      "Emergency": { variant: "emergency", icon: "AlertTriangle", text: "Emergency" },
      
      // Medical Status
      "Stable": { variant: "stable", icon: "Heart", text: "Stable" },
      "Monitoring": { variant: "monitoring", icon: "Activity", text: "Monitoring" },
      "Critical": { variant: "critical", icon: "AlertCircle", text: "Critical" },
      
      // General Status
      "Active": { variant: "success", icon: "CheckCircle", text: "Active" },
      "Inactive": { variant: "error", icon: "XCircle", text: "Inactive" },
      "Pending": { variant: "warning", icon: "Clock", text: "Pending" }
    };
    
    return configs[status] || { variant: "default", icon: "Circle", text: status };
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant}>
      {showIcon && (
        <ApperIcon name={config.icon} className="h-3 w-3 mr-1" />
      )}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;