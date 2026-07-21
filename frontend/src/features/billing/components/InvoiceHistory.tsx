import React from 'react';
import { useBillingStore } from '../store/useBillingStore';
import { Download, FileText } from 'lucide-react';
import api from '@/utils/axios';

export const InvoiceHistory = () => {
  const { invoices } = useBillingStore();

  const handleDownload = async (paymentId: string, invoiceNumber: string) => {
    try {
      const response = await api.get(`/v1/invoices/${paymentId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Failed to download invoice:', err);
    }
  };

  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Invoice History</h2>
        <div className="text-center py-8 text-gray-500">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p>No invoices found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Invoice History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Invoice Number</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Date</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600">Amount</th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium">{inv.invoiceNumber}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900">${(inv.amount + inv.tax).toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleDownload(inv.paymentId, inv.invoiceNumber)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    <Download size={16} className="mr-1" /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
