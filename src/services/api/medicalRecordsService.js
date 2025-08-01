import medicalRecordsData from "@/services/mockData/medicalRecords.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const medicalRecordsService = {
  async getByPatientId(patientId) {
    await delay(300);
    const record = medicalRecordsData.find(r => r.patientId === parseInt(patientId));
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
    return { ...record };
  },

  async update(patientId, recordData) {
    await delay(400);
    const index = medicalRecordsData.findIndex(r => r.patientId === parseInt(patientId));
    if (index === -1) {
      const newRecord = {
        Id: Math.max(...medicalRecordsData.map(r => r.Id)) + 1,
        patientId: parseInt(patientId),
        ...recordData
      };
      medicalRecordsData.push(newRecord);
      return { ...newRecord };
    }
    medicalRecordsData[index] = { ...medicalRecordsData[index], ...recordData };
    return { ...medicalRecordsData[index] };
  }
};