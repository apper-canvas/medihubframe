import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { metricsService } from "@/services/api/metricsService";
import { activitiesService } from "@/services/api/activitiesService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [metricsData, activitiesData] = await Promise.all([
        metricsService.getMetrics(),
        activitiesService.getRecent(8)
      ]);
      
      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const quickActions = [
    {
      label: "Add New Patient",
      icon: "UserPlus",
      onClick: () => navigate("/patients"),
      color: "from-primary to-blue-600"
    },
    {
      label: "Emergency Alert",
      icon: "AlertTriangle",
      onClick: () => toast.info("Emergency protocol activated"),
      color: "from-error to-red-600"
    },
    {
      label: "View Reports",
      icon: "BarChart3",
      onClick: () => navigate("/reports"),
      color: "from-success to-green-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-blue-50 to-accent/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to MediHub Pro
            </h2>
            <p className="text-gray-600">
              Today is {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </div>
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <ApperIcon name="Heart" className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value={metrics.totalPatients.toLocaleString()}
          icon="Users"
          trend="up"
          trendValue="+12 this week"
        />
        <MetricCard
          title="Today's Appointments"
          value={metrics.todayAppointments}
          icon="Calendar"
          trend="up"
          trendValue="+5 from yesterday"
        />
        <MetricCard
          title="Available Beds"
          value={metrics.availableBeds}
          icon="Bed"
          trend="down"
          trendValue="-3 from yesterday"
        />
        <MetricCard
          title="Pending Tasks"
          value={metrics.pendingTasks}
          icon="Clock"
          trend="down"
          trendValue="-2 completed"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Emergency Cases"
          value={metrics.emergencyCases}
          icon="AlertTriangle"
          className="border-l-4 border-error"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${metrics.occupancyRate}%`}
          icon="Building"
          trend="up"
          trendValue="+2.1%"
        />
        <MetricCard
          title="Patient Satisfaction"
          value={`${metrics.patientSatisfaction}/5`}
          icon="Star"
          trend="up"
          trendValue="+0.2 points"
        />
      </div>

      {/* Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                className={`w-full justify-start bg-gradient-to-r ${action.color} text-white hover:shadow-lg hover:scale-105`}
              >
                <ApperIcon name={action.icon} className="h-4 w-4 mr-3" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} loading={false} />
        </div>
      </div>

      {/* Hospital Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Users" className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.totalStaff}</p>
            <p className="text-sm text-gray-600">Total Staff</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="h-12 w-12 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.dischargedToday}</p>
            <p className="text-sm text-gray-600">Discharged Today</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
            <div className="h-12 w-12 bg-gradient-to-br from-warning to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="Clock" className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.averageStayDays}</p>
            <p className="text-sm text-gray-600">Avg Stay (Days)</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.occupancyRate}%</p>
            <p className="text-sm text-gray-600">Occupancy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;