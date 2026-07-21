import { create } from 'zustand';

interface BillingState {
  currentPlan: string;
  status: string;
  usage: any;
  invoices: any[];
  setDashboardData: (data: any) => void;
}

export const useBillingStore = create<BillingState>((set) => ({
  currentPlan: 'Free',
  status: 'INACTIVE',
  usage: null,
  invoices: [],
  setDashboardData: (data) => set({
    currentPlan: data.currentPlan,
    status: data.status,
    usage: data.usage,
    invoices: data.invoices
  }),
}));
