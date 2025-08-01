import activitiesData from "@/services/mockData/activities.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activitiesService = {
  async getRecent(limit = 10) {
    await delay(250);
    const sortedActivities = [...activitiesData]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    return sortedActivities;
  },

  async getAll() {
    await delay(300);
    return [...activitiesData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  async create(activityData) {
    await delay(200);
    const maxId = Math.max(...activitiesData.map(a => a.Id));
    const newActivity = {
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      ...activityData
    };
    activitiesData.unshift(newActivity);
    return { ...newActivity };
  }
};