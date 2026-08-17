const BASE_URL = "http://localhost:5299/auth";

const apiClient = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  
  return await response.text();
};

export const login = (credentials) => {
  return apiClient("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = (userData) => {
  return apiClient("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logout = () => {
  return apiClient("/logout", {
    method: "POST",
  });
};