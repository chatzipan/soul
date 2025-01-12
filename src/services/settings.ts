import { RestaurantSettings } from "../../functions/src/types/settings";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const API_URL = process.env.GATSBY_API_URL;

export const getSettings = async () => {
  try {
    const res = await fetch(`${API_URL}/v1/settings`, {
      method: "GET",
      headers: getHeaders(),
    });

    const response = (await res.json()) as RestaurantSettings;
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateSettings = async (settings: Partial<RestaurantSettings>) => {
  try {
    const res = await fetch(`${API_URL}/v1/settings`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(settings),
    });

    const response = await res.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
