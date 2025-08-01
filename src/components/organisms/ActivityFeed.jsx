import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type) => {
    const icons = {
      admission: "UserPlus",
      discharge: "UserMinus", 
      appointment: "Calendar",
      treatment: "Activity",
      medication: "Pill",
      emergency: "AlertTriangle"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      admission: "bg-success/10 text-success",
      discharge: "bg-blue-50 text-blue-600",
      appointment: "bg-purple-50 text-purple-600",
      treatment: "bg-orange-50 text-orange-600",
      medication: "bg-green-50 text-green-600",
      emergency: "bg-error/10 text-error"
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={activity.Id}>
              <div className="relative pb-8">
                {index !== activities.length - 1 && (
                  <span 
                    className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                    aria-hidden="true" 
                  />
                )}
                <div className="relative flex space-x-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="h-4 w-4" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.patientName}</span>
                        {" "}{activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ActivityFeed;