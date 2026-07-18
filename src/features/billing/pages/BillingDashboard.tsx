import React, { useEffect, useState } from 'react';
import { getBillingDashboard } from '../api/billingApi';
import { useBillingStore } from '../store/useBillingStore';
import { BillingSummary } from '../components/BillingSummary';
import { UsageCards } from '../components/UsageCards';
import { InvoiceHistory } from '../components/InvoiceHistory';
import { useNavigate } from 'react-router-dom';

export const BillingDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { setDashboardData } = useBillingStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getBillingDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch billing dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [setDashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
        <button 
          onClick={() => navigate('/dashboard/pricing')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Upgrade Plan
        </button>
      </div>

      <BillingSummary />
      
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Usage Analytics</h2>
      <UsageCards />
      
      <InvoiceHistory />
    </div>
  );
};
