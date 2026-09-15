import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 30000,
});

export const fetchNearbyPlaces = async ({ lat, lon, category, radius }) => {
  const params = {
    lat,
    lon,
    category,
  };

  if (radius) {
    params.radius = radius;
  }

  const response = await apiClient.get("/nearby-places/", { params });
  return response.data;
};
