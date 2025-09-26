import API from "../services/api";

export const refreshAccessToken = async (): Promise<void> => {
  try {
    await API.post("/refresh", {}, { withCredentials: true });
    console.log("Access token refreshed successfully");
  } catch (err) {
    console.error("Failed to refresh access token", err);
  }
};

let refreshInterval: NodeJS.Timeout | null = null;

export const startTokenRefresh = (): void => {
  if (refreshInterval) clearInterval(refreshInterval); 
  refreshInterval = setInterval(() => {
    refreshAccessToken();
  }, (15 * 60 - 10) * 1000);
};

export const stopTokenRefresh = (): void => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
