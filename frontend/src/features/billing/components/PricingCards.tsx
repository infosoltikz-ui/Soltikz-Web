import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { createOrder, verifyPayment } from '../api/billingApi';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: 0,
    features: ['1 Resume', '2 Cover Letters / Month', '5 AI Generations', '3 ATS Scans', 'Basic Templates'],
  },
  {
    name: 'Starter',
    price: 9.99,
    features: ['10 Resumes', '30 Cover Letters', '100 AI Generations', '50 ATS Scans', 'Premium Templates'],
  },
  {
    name: 'Pro',
    price: 19.99,
    popular: true,
    features: ['Unlimited Resumes', 'Unlimited Cover Letters', 'Unlimited ATS Scans', 'Unlimited AI', 'Resume Analytics', 'Priority Processing'],
  },
  {
    name: 'Enterprise',
    price: 49.99,
    features: ['Everything Unlimited', 'Team Access', 'Admin Controls', 'API Access', 'Dedicated Support'],
  },
];

export const PricingCards = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.price === 0) return; // Free plan logic if needed

    try {
      setLoading(true);
      // Create Razorpay order on backend
      const order = await createOrder(plan.name, 'MONTHLY', plan.price);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key',
        amount: order.amount,
        currency: order.currency,
        name: 'AI Resume Builder',
        description: `${plan.name} Plan Subscription`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planName: plan.name,
              billingCycle: 'MONTHLY'
            });
            navigate('/dashboard/billing');
          } catch (err) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed.');
          }
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed', response.error);
        alert('Payment failed.');
      });
      rzp.open();
    } catch (err) {
      console.error('Failed to create order', err);
      alert('Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`bg-white rounded-2xl shadow-sm border flex flex-col ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 scale-105' : 'border-gray-200'} p-8 transform transition-all hover:shadow-lg`}
        >
          {plan.popular && (
            <span className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full self-start mb-4">
              Most Popular
            </span>
          )}
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
          <p className="mt-4 flex items-baseline text-gray-900">
            <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
            <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
          </p>
          <ul className="mt-6 space-y-4 flex-1">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex space-x-3 items-center">
                <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            disabled={loading}
            onClick={() => handleSubscribe(plan)}
            className={`mt-8 w-full py-3 px-4 rounded-xl font-medium transition-colors ${
              plan.popular
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {plan.price === 0 ? 'Current Plan' : 'Subscribe Now'}
          </button>
        </div>
      ))}
    </div>
  );
};
