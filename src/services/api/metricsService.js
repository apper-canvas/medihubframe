const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const metricsService = {
  async getMetrics() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "total_patients_c"}},
          {"field": {"Name": "today_appointments_c"}},
          {"field": {"Name": "available_beds_c"}},
          {"field": {"Name": "pending_tasks_c"}},
          {"field": {"Name": "total_staff_c"}},
          {"field": {"Name": "emergency_cases_c"}},
          {"field": {"Name": "discharged_today_c"}},
          {"field": {"Name": "average_stay_days_c"}},
          {"field": {"Name": "occupancy_rate_c"}},
          {"field": {"Name": "patient_satisfaction_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await apperClient.fetchRecords("metric_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch metrics:", response.message);
        throw new Error(response.message);
      }

      const metricsRecord = response.data?.[0];
      if (!metricsRecord) {
        // Return default metrics if no data exists
        return {
          totalPatients: 0,
          todayAppointments: 0,
          availableBeds: 0,
          pendingTasks: 0,
          totalStaff: 0,
          emergencyCases: 0,
          dischargedToday: 0,
          averageStayDays: 0,
          occupancyRate: 0,
          patientSatisfaction: 0
        };
      }

      // Transform database field names to UI field names
      return {
        totalPatients: metricsRecord.total_patients_c || 0,
        todayAppointments: metricsRecord.today_appointments_c || 0,
        availableBeds: metricsRecord.available_beds_c || 0,
        pendingTasks: metricsRecord.pending_tasks_c || 0,
        totalStaff: metricsRecord.total_staff_c || 0,
        emergencyCases: metricsRecord.emergency_cases_c || 0,
        dischargedToday: metricsRecord.discharged_today_c || 0,
        averageStayDays: metricsRecord.average_stay_days_c || 0,
        occupancyRate: metricsRecord.occupancy_rate_c || 0,
        patientSatisfaction: metricsRecord.patient_satisfaction_c || 0
      };
    } catch (error) {
      console.error("Error fetching metrics:", error?.response?.data?.message || error);
      throw error;
    }
  }
};