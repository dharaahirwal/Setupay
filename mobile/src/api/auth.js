import client from './client';

export const login = async (username, password) => {
  const response = await client.post('/auth/login', { username, password });
  return response.data;
};

export const getMe = async () => {
  const response = await client.get('/auth/me');
  return response.data;
};

export const setUpiPin = async (pin, password) => {
  const response = await client.post('/auth/set-upi-pin', { pin, password });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await client.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  return response.data;
};
