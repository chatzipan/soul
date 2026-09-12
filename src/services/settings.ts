import { AutoReplySettings } from "../../functions/src/types/autoReply";
import { RestaurantSettings } from "../../functions/src/types/settings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = process.env.GATSBY_API_URL;

export const getSettings = async () => {
  try {
    return await fetchWithAuth<RestaurantSettings>(`${API_URL}/v1/settings`, {
      method: "GET",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOpeningHours = async () => {
  try {
    return await fetchWithAuth<RestaurantSettings>(
      `${API_URL}/v1/public/settings/opening-hours`,
      {
        method: "GET",
      },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateSettings = async (settings: Partial<RestaurantSettings>) => {
  try {
    return await fetchWithAuth<RestaurantSettings>(`${API_URL}/v1/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAutoReplySettings = async () => {
  try {
    return await fetchWithAuth<AutoReplySettings>(
      `${API_URL}/v1/settings/auto-reply`,
      { method: "GET" },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAutoReplySettings = async (
  settings: Partial<AutoReplySettings>,
) => {
  try {
    return await fetchWithAuth<AutoReplySettings>(
      `${API_URL}/v1/settings/auto-reply`,
      { method: "PUT", body: JSON.stringify(settings) },
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};
