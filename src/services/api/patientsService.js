const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientsService = {
  async getAll() {
    await delay(400);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "assigned_doctor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "medical_status_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "insurance_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "room_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords("patient_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch patients:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(patient => ({
        Id: patient.Id,
        name: patient.name_c,
        age: patient.age_c,
        gender: patient.gender_c,
        phone: patient.phone_c,
        email: patient.email_c,
        address: patient.address_c,
        admissionDate: patient.admission_date_c,
        assignedDoctor: patient.assigned_doctor_c,
        status: patient.status_c,
        medicalStatus: patient.medical_status_c,
        emergencyContact: {
          name: patient.emergency_contact_name_c,
          relationship: patient.emergency_contact_relationship_c,
          phone: patient.emergency_contact_phone_c
        },
        insurance: patient.insurance_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        room: patient.room_c
      }));
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "age_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "admission_date_c"}},
          {"field": {"Name": "assigned_doctor_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "medical_status_c"}},
          {"field": {"Name": "emergency_contact_name_c"}},
          {"field": {"Name": "emergency_contact_relationship_c"}},
          {"field": {"Name": "emergency_contact_phone_c"}},
          {"field": {"Name": "insurance_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "room_c"}}
        ]
      };

      const response = await apperClient.getRecordById("patient_c", parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch patient:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Patient not found");
      }

      const patient = response.data;

      // Transform database field names to UI field names
      return {
        Id: patient.Id,
        name: patient.name_c,
        age: patient.age_c,
        gender: patient.gender_c,
        phone: patient.phone_c,
        email: patient.email_c,
        address: patient.address_c,
        admissionDate: patient.admission_date_c,
        assignedDoctor: patient.assigned_doctor_c,
        status: patient.status_c,
        medicalStatus: patient.medical_status_c,
        emergencyContact: {
          name: patient.emergency_contact_name_c,
          relationship: patient.emergency_contact_relationship_c,
          phone: patient.emergency_contact_phone_c
        },
        insurance: patient.insurance_c,
        bloodType: patient.blood_type_c,
        allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
        room: patient.room_c
      };
    } catch (error) {
      console.error("Error fetching patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(patientData) {
    await delay(500);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI field names to database field names
      const dbPatientData = {
        name_c: patientData.name,
        age_c: patientData.age,
        gender_c: patientData.gender,
        phone_c: patientData.phone,
        email_c: patientData.email,
        address_c: patientData.address,
        admission_date_c: patientData.admissionDate || new Date().toISOString(),
        assigned_doctor_c: patientData.assignedDoctor,
        status_c: patientData.status,
        medical_status_c: patientData.medicalStatus,
        emergency_contact_name_c: patientData.emergencyContact?.name,
        emergency_contact_relationship_c: patientData.emergencyContact?.relationship,
        emergency_contact_phone_c: patientData.emergencyContact?.phone,
        insurance_c: patientData.insurance,
        blood_type_c: patientData.bloodType,
        allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : patientData.allergies,
        room_c: patientData.room
      };

      const params = {
        records: [dbPatientData]
      };

      const response = await apperClient.createRecord("patient_c", params);

      if (!response.success) {
        console.error("Failed to create patient:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create patient:`, failed);
          throw new Error(failed[0].message || "Failed to create patient");
        }

        const created = response.results.find(r => r.success);
        if (created) {
          const patient = created.data;
          // Transform back to UI format
          return {
            Id: patient.Id,
            name: patient.name_c,
            age: patient.age_c,
            gender: patient.gender_c,
            phone: patient.phone_c,
            email: patient.email_c,
            address: patient.address_c,
            admissionDate: patient.admission_date_c,
            assignedDoctor: patient.assigned_doctor_c,
            status: patient.status_c,
            medicalStatus: patient.medical_status_c,
            emergencyContact: {
              name: patient.emergency_contact_name_c,
              relationship: patient.emergency_contact_relationship_c,
              phone: patient.emergency_contact_phone_c
            },
            insurance: patient.insurance_c,
            bloodType: patient.blood_type_c,
            allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
            room: patient.room_c
          };
        }
      }

      throw new Error("No valid response from server");
    } catch (error) {
      console.error("Error creating patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, patientData) {
    await delay(300);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Transform UI field names to database field names
      const dbPatientData = {
        Id: parseInt(id),
        name_c: patientData.name,
        age_c: patientData.age,
        gender_c: patientData.gender,
        phone_c: patientData.phone,
        email_c: patientData.email,
        address_c: patientData.address,
        admission_date_c: patientData.admissionDate,
        assigned_doctor_c: patientData.assignedDoctor,
        status_c: patientData.status,
        medical_status_c: patientData.medicalStatus,
        emergency_contact_name_c: patientData.emergencyContact?.name,
        emergency_contact_relationship_c: patientData.emergencyContact?.relationship,
        emergency_contact_phone_c: patientData.emergencyContact?.phone,
        insurance_c: patientData.insurance,
        blood_type_c: patientData.bloodType,
        allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : patientData.allergies,
        room_c: patientData.room
      };

      const params = {
        records: [dbPatientData]
      };

      const response = await apperClient.updateRecord("patient_c", params);

      if (!response.success) {
        console.error("Failed to update patient:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update patient:`, failed);
          throw new Error(failed[0].message || "Failed to update patient");
        }

        const updated = response.results.find(r => r.success);
        if (updated) {
          const patient = updated.data;
          // Transform back to UI format
          return {
            Id: patient.Id,
            name: patient.name_c,
            age: patient.age_c,
            gender: patient.gender_c,
            phone: patient.phone_c,
            email: patient.email_c,
            address: patient.address_c,
            admissionDate: patient.admission_date_c,
            assignedDoctor: patient.assigned_doctor_c,
            status: patient.status_c,
            medicalStatus: patient.medical_status_c,
            emergencyContact: {
              name: patient.emergency_contact_name_c,
              relationship: patient.emergency_contact_relationship_c,
              phone: patient.emergency_contact_phone_c
            },
            insurance: patient.insurance_c,
            bloodType: patient.blood_type_c,
            allergies: patient.allergies_c ? patient.allergies_c.split(',').map(a => a.trim()) : [],
            room: patient.room_c
          };
        }
      }

      throw new Error("No valid response from server");
    } catch (error) {
      console.error("Error updating patient:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    await delay(200);
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("patient_c", params);

      if (!response.success) {
        console.error("Failed to delete patient:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete patient:`, failed);
          throw new Error(failed[0].message || "Failed to delete patient");
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting patient:", error?.response?.data?.message || error);
      throw error;
}
  }
};