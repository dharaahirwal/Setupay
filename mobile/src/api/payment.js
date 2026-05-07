import client from './client';

export const getBalance = async () => {
  const response = await client.get('/payment/balance');
  return response.data;
};

export const searchUser = async (query) => {
  const response = await client.get(`/payment/search-user?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const sendMoney = async ({ receiverUpiId, amount, upiPin, note }) => {
  const response = await client.post('/payment/send', {
    receiverUpiId,
    amount,
    upiPin,
    note,
  });
  return response.data;
};

export const getTransactions = async (page = 1, limit = 20) => {
  const response = await client.get(`/payment/transactions?page=${page}&limit=${limit}`);
  return response.data;
};

export const getTransactionDetail = async (transactionId) => {
  const response = await client.get(`/payment/transaction/${transactionId}`);
  return response.data;
};
