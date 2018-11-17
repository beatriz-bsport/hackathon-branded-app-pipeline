import { API_URI, getAuth, getJSONAuth } from '../http';

export async function fetchDashboardStats() {
  return getAuth(`${API_URI}/saas/stats/dashboard`);
}

export async function fetchAllActivitiesStats() {
  return getAuth(`${API_URI}/saas/stats/meta-activity`);
}

export async function fetchActivityStats(metaActivityId) {
  return getAuth(`${API_URI}/saas/stats/meta-activity/${metaActivityId}`);
}

export async function bookings() {
  return getJSONAuth(`${API_URI}/statistics/bookings`);
}
export async function newMembers() {
  return getJSONAuth(`${API_URI}/statistics/new-members`);
}
export async function turnover() {
  return getJSONAuth(`${API_URI}/statistics/turnover`);
}

export default {
  fetchDashboard: fetchDashboardStats,
  fetchActivities: fetchAllActivitiesStats,
  fetchActivity: fetchActivityStats,
  bookings,
  newMembers,
  turnover,
};
