import api from '@/utils/axios';

export const getBillingDashboard = async () => {
  const response = await api.get('/v1/billing');
  return response.data;
};

export const getUsage = async () => {
  const response = await api.get('/v1/usage');
  return response.data;
};

export const createOrder = async (planName: string, billingCycle: 'MONTHLY' | 'YEARLY', amount: number) => {
  const response = await api.post('/v1/payment/create-order', { planName, billingCycle, amount });
  return response.data;
};

export const verifyPayment = async (data: any) => {
  const response = await api.post('/v1/payment/verify', data);
  return response.data;
};

export const cancelSubscription = async () => {
  const response = await api.post('/v1/subscription/cancel');
  return response.data;
};
