import patientsData from "@/services/mockData/patients.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const patientsService = {
  async getAll() {
    await delay(400);
    return [...patientsData];
  },

  async getById(id) {
    await delay(200);
    const patient = patientsData.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patientData) {
    await delay(500);
    const maxId = Math.max(...patientsData.map(p => p.Id));
    const newPatient = {
      Id: maxId + 1,
      ...patientData,
      admissionDate: new Date().toISOString()
    };
    patientsData.push(newPatient);
    return { ...newPatient };
  },

  async update(id, patientData) {
    await delay(300);
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patientsData[index] = { ...patientsData[index], ...patientData };
    return { ...patientsData[index] };
  },

  async delete(id) {
    await delay(200);
    const index = patientsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    const deletedPatient = patientsData.splice(index, 1)[0];
    return { ...deletedPatient };
  }
};