// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};

// Get user token
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Set authentication token
export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  // Dispatch storage event for cross-tab communication
  window.dispatchEvent(new Event('storage'));
};

// Remove authentication token
export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

// Get authenticated user
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Set user data
export const setUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  // Dispatch storage event for cross-tab communication
  window.dispatchEvent(new Event('storage'));
};

// Remove user data
export const removeUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
};

// Logout user
export const logout = () => {
  removeToken();
  removeUser();
  // Dispatch storage event for cross-tab communication
  window.dispatchEvent(new Event('storage'));
}; 