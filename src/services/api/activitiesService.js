const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activitiesService = {
  async getRecent(limit = 10) {
    await delay(250);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "doctor_c"}},
          {"field": {"Name": "patient_id_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        patientName: activity.patient_name_c,
        patientId: activity.patient_id_c?.Id || activity.patient_id_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        doctor: activity.doctor_c
      }));
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getAll() {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "patient_name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "doctor_c"}},
          {"field": {"Name": "patient_id_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c,
        patientName: activity.patient_name_c,
        patientId: activity.patient_id_c?.Id || activity.patient_id_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c,
        doctor: activity.doctor_c
      }));
    } catch (error) {
      console.error("Error fetching all activities:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(activityData) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI field names to database field names
      const dbActivityData = {
        type_c: activityData.type,
        patient_name_c: activityData.patientName,
        description_c: activityData.description,
        timestamp_c: activityData.timestamp || new Date().toISOString(),
        doctor_c: activityData.doctor,
        patient_id_c: activityData.patientId ? parseInt(activityData.patientId) : null
      };

      const params = {
        records: [dbActivityData]
      };

      const response = await apperClient.createRecord("activity_c", params);

      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          throw new Error(failed[0].message || "Failed to create activity");
        }

        const created = response.results.find(r => r.success);
        if (created) {
          // Transform back to UI format
          return {
            Id: created.data.Id,
            type: created.data.type_c,
            patientName: created.data.patient_name_c,
            patientId: created.data.patient_id_c?.Id || created.data.patient_id_c,
            description: created.data.description_c,
            timestamp: created.data.timestamp_c,
            doctor: created.data.doctor_c
          };
        }
      }

      throw new Error("No valid response from server");
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }
};