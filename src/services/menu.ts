import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = process.env.GATSBY_API_URL;

interface MenuUpdateResponse {
  message: string;
  changes: string[];
}

export const updateMenu = async () => {
  try {
    return await fetchWithAuth<MenuUpdateResponse>(`${API_URL}/v1/menu`, {
      method: "POST",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
