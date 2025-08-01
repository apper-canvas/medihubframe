import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Staff = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Directory</h2>
          <p className="text-gray-600 mt-1">Manage hospital staff and their information</p>
        </div>
      </div>

      <Card className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="UserCheck" className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Staff Management Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md">
              The staff directory and management system is under development. This feature will include
              staff profiles, schedules, and contact information management.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Staff;