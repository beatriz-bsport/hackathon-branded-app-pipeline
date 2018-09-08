import { API_URI, getAuth } from '../http';

export async function fetchDashboardStats() {
  return getAuth(`${API_URI}/saas/stats/dashboard`);
}

export async function fetchAllActivitiesStats() {
  return getAuth(`${API_URI}/saas/stats/meta-activity`);
}

export async function fetchActivityStats(metaActivityId) {
  return getAuth(`${API_URI}/saas/stats/meta-activity/${metaActivityId}`);
}

export default {
  fetchDashboard: fetchDashboardStats,
  fetchActivities: fetchAllActivitiesStats,
  fetchActivity: fetchActivityStats,
};
