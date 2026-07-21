import React from 'react';
import { useBillingStore } from '../store/useBillingStore';

export const BillingSummary = () => {
  const { currentPlan, status } = useBillingStore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Current Plan</p>
          <p className="text-2xl font-bold text-gray-900">{currentPlan}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};
