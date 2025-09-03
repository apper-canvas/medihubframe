const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const medicalRecordsService = {
  async getByPatientId(patientId) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "history_c"}},
          {"field": {"Name": "current_treatment_c"}},
          {"field": {"Name": "medications_c"}},
          {"field": {"Name": "lab_results_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "patient_id_c"}}
        ],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}]
      };

      const response = await apperClient.fetchRecords("medical_record_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch medical record:", response.message);
        throw new Error(response.message);
      }

      const record = response.data?.[0];
      if (!record) {
        // Return empty record structure if none exists
        return {
          patientId: parseInt(patientId),
          history: [],
          currentTreatment: null,
          medications: [],
          labResults: [],
          notes: []
        };
      }

      // Parse JSON fields and transform to UI format
      return {
        Id: record.Id,
        patientId: record.patient_id_c?.Id || parseInt(patientId),
        history: record.history_c ? JSON.parse(record.history_c) : [],
        currentTreatment: record.current_treatment_c ? JSON.parse(record.current_treatment_c) : null,
        medications: record.medications_c ? JSON.parse(record.medications_c) : [],
        labResults: record.lab_results_c ? JSON.parse(record.lab_results_c) : [],
        notes: record.notes_c ? JSON.parse(record.notes_c) : []
      };
    } catch (error) {
      console.error("Error fetching medical record:", error?.response?.data?.message || error);
      // Return empty structure on error
      return {
        patientId: parseInt(patientId),
        history: [],
        currentTreatment: null,
        medications: [],
        labResults: [],
        notes: []
      };
    }
  },

  async update(patientId, recordData) {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First, try to find existing record
      const existingParams = {
        fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "patient_id_c"}}],
        where: [{"FieldName": "patient_id_c", "Operator": "EqualTo", "Values": [parseInt(patientId)]}]
      };

      const existingResponse = await apperClient.fetchRecords("medical_record_c", existingParams);
      
      if (!existingResponse.success) {
        console.error("Failed to check existing record:", existingResponse.message);
        throw new Error(existingResponse.message);
      }

      // Transform UI data to database format
      const dbRecordData = {
        history_c: recordData.history ? JSON.stringify(recordData.history) : null,
        current_treatment_c: recordData.currentTreatment ? JSON.stringify(recordData.currentTreatment) : null,
        medications_c: recordData.medications ? JSON.stringify(recordData.medications) : null,
        lab_results_c: recordData.labResults ? JSON.stringify(recordData.labResults) : null,
        notes_c: recordData.notes ? JSON.stringify(recordData.notes) : null,
        patient_id_c: parseInt(patientId)
      };

      const existingRecord = existingResponse.data?.[0];
      let response;

      if (existingRecord) {
        // Update existing record
        const updateParams = {
          records: [{
            Id: existingRecord.Id,
            ...dbRecordData
          }]
        };
        response = await apperClient.updateRecord("medical_record_c", updateParams);
      } else {
        // Create new record
        const createParams = {
          records: [dbRecordData]
        };
        response = await apperClient.createRecord("medical_record_c", createParams);
      }

      if (!response.success) {
        console.error("Failed to save medical record:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to save medical record:`, failed);
          throw new Error(failed[0].message || "Failed to save medical record");
        }

        const saved = response.results.find(r => r.success);
        if (saved) {
          // Transform back to UI format
          return {
            Id: saved.data.Id,
            patientId: saved.data.patient_id_c?.Id || parseInt(patientId),
            history: saved.data.history_c ? JSON.parse(saved.data.history_c) : [],
            currentTreatment: saved.data.current_treatment_c ? JSON.parse(saved.data.current_treatment_c) : null,
            medications: saved.data.medications_c ? JSON.parse(saved.data.medications_c) : [],
            labResults: saved.data.lab_results_c ? JSON.parse(saved.data.lab_results_c) : [],
            notes: saved.data.notes_c ? JSON.parse(saved.data.notes_c) : []
          };
        }
      }

      throw new Error("No valid response from server");
    } catch (error) {
      console.error("Error updating medical record:", error?.response?.data?.message || error);
      throw error;
    }
}
};