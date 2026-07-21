import React from 'react';
import { PricingCards } from '../components/PricingCards';

export const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Pricing</h2>
        <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Choose the right plan for your career
        </p>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          From a simple resume update to an enterprise-grade recruiting toolkit, we've got you covered.
        </p>
      </div>

      <div className="mt-16">
        <PricingCards />
      </div>
    </div>
  );
};
