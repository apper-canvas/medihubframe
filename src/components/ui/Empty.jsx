import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found", 
  description = "There are no items to display at this time.",
  icon = "Inbox",
  actionLabel,
  onAction
}) => {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;