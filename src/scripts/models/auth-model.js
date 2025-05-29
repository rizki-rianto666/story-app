import CONFIG from "../config";

// REGISTER
export async function getRegisterModel({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });
  const fetchResponse = await fetch(`${CONFIG.STORY_APP_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });

  const jsonData = await fetchResponse.json();

  return {
    ...jsonData,
    ok: fetchResponse.ok,
  };
}

export async function getLoginModel({ email, password }) {
  const fetchResponse = await fetch(`${CONFIG.STORY_APP_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const jsonData = await fetchResponse.json();
  console.log(fetchResponse);
  console.log("JSON Data", jsonData);
  return {
    ...jsonData,
    ok: fetchResponse.ok,
  };
}

// LOCAL STORAGE

export function putAccessToken(token) {
  try {
    localStorage.setItem(CONFIG.ACCESS_TOKEN_VAR, token);
    return true;
  } catch (error) {
    console.error("putAccessToken: error:", error);
    return false;
  }
}

export function getAccessToken() {
  const accesToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_VAR);
  if (!accesToken) {
    return null;
  }
  return accesToken;
}

export function removeAccesToken() {
  const accesToken = localStorage.getItem(CONFIG.ACCESS_TOKEN_VAR);
  if (!accesToken) {
    return null;
  }
  localStorage.removeItem(CONFIG.ACCESS_TOKEN_VAR);
  return true;
}

export function putUser(name) {
  try {
    localStorage.setItem(CONFIG.USER, name);
    return true;
  } catch (error) {
    console.error("putUser: error:", error);
    return false;
  }
}

export function getUser() {
  const user = localStorage.getItem(CONFIG.USER);
  if (!user) {
    return null;
  }
  return user;
}
