import CONFIG from "../config";
import { getAccessToken } from "../models/auth-model";
const ENDPOINTS = {
  STORIES: `${CONFIG.STORY_APP_BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.STORY_APP_BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.STORY_APP_BASE_URL}/notifications/subscribe`,
};

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });
 
  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
 
export async function unsubscribePushNotification( endpoint ) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });
 
  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();
 
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export default ENDPOINTS;