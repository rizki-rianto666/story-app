import CONFIG from "../config";
import ENDPOINTS from "../data/api";

const token = localStorage.getItem(CONFIG.ACCESS_TOKEN_VAR);

export async function getAllStories() {
  try {
    const response = await fetch(`${ENDPOINTS.STORIES}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const allStories = await response.json();

    console.log(response)
    return {
      ...allStories,
    };
  } catch (error) {
    return {
      message: error,
      error: true
    }
  }
}

export async function getStory(id) {
  try {
    const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const story = await response.json();
    return story;
  } catch (error) {
     return {
      message: error,
      error: true
    }
  }
}

export async function addStory(formData) {

  const response = await fetch(`${ENDPOINTS.STORIES}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add story");
  }

  return response.json();
}
