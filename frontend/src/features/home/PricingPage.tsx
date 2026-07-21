import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, X, Crown, ShieldCheck, Lock, Headphones, 
  HelpCircle, ChevronDown, FileText, Sparkles
} from 'lucide-react'
import { Button } from '@components/ui/Button'
import { ROUTES } from '@constants'

// ============================================================
// SECTIONS
// ============================================================

function PricingHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-green-50 via-white to-white">
      {/* Decorative background blur blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-green-100/50 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-bold shadow-sm border border-green-200">
          <Crown className="w-4 h-4 text-amber-500" />
          Simple. Transparent. Powerful.
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.2]">
          Choose the Plan That's Right <br />
          for <span className="text-primary">Your Career</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Build ATS-optimized resumes, get smarter suggestions and land more interviews with our AI-powered platform.
        </p>
      </div>
    </section>
  )
}

function PricingCards() {
  return (
    <section className="relative z-20 -mt-16 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Free</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Perfect for getting started</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 font-medium"> /forever</span>
            </div>
            
            <ul className="space-y-4 mb-8 w-full text-left">
              {[
                '1 Resume',
                'Basic Templates (5)',
                'ATS Score Check (5/month)',
                'AI Suggestions (Limited)',
                'Download in PDF'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-green-50 font-bold h-12 rounded-xl mt-auto">
              Get Started Free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-3xl border-2 border-primary shadow-2xl shadow-primary/20 flex flex-col relative transform md:-translate-y-4">
            <div className="bg-primary text-white text-center py-2 rounded-t-[1.35rem] font-bold text-sm flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
              Most Popular
            </div>
            <div className="p-8 flex flex-col items-center text-center">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Pro</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">For serious job seekers</p>
              <div className="mb-2">
                <span className="text-5xl font-extrabold text-slate-900">$9.99</span>
                <span className="text-slate-500 font-medium"> /month</span>
              </div>
              <p className="text-xs font-bold text-primary mb-8">or $79.99/year (Save 33%)</p>
              
              <ul className="space-y-4 mb-8 w-full text-left">
                {[
                  'Unlimited Resumes',
                  '25+ Premium Templates',
                  'Unlimited ATS Checks',
                  'AI-Powered Suggestions',
                  'Cover Letter Builder',
                  'Job Tracker',
                  'Multiple Export Formats (PDF, DOCX)'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={3} />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="w-full mt-auto space-y-3">
                <Button className="w-full bg-primary hover:bg-green-700 text-white font-bold h-12 rounded-xl">
                  Start 7-Day Free Trial
                </Button>
                <p className="text-xs text-slate-400 font-medium">Cancel anytime</p>
              </div>
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center">
            <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Business</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">For teams & organizations</p>
            <div className="mb-2">
              <span className="text-5xl font-extrabold text-slate-900">$19.99</span>
              <span className="text-slate-500 font-medium"> /month</span>
            </div>
            <p className="text-xs font-bold text-primary mb-8">or $199.99/year (Save 33%)</p>
            
            <ul className="space-y-4 mb-8 w-full text-left">
              {[
                'Everything in Pro',
                'Team Management (Up to 5 Members)',
                'Shared Templates',
                'Analytics & Reports',
                'Priority Support',
                'Custom Branding'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="w-full mt-auto space-y-3">
              <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-green-50 font-bold h-12 rounded-xl">
                Start 7-Day Free Trial
              </Button>
              <p className="text-xs text-slate-400 font-medium">Cancel anytime</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function TrustIndicators() {
  return (
    <section className="py-8 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <ShieldCheck className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">7-Day Money Back Guarantee</h4>
              <p className="text-xs text-slate-500">Not satisfied? Get a full refund.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <Lock className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Secure Payments</h4>
              <p className="text-xs text-slate-500">Your payments are 100% secure.</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 py-4 md:py-0">
            <Headphones className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500">We're here to help you succeed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareTable() {
  const check = <Check className="w-5 h-5 text-primary mx-auto" strokeWidth={3} />
  const cross = <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mx-auto"><X className="w-3 h-3 text-red-600" strokeWidth={4} /></div>

  const rows = [
    { label: 'Number of Resumes', free: '1', pro: 'Unlimited', biz: 'Unlimited' },
    { label: 'Resume Templates', free: '5 Basic', pro: '25+ Premium', biz: '25+ Premium' },
    { label: 'ATS Score Checks', free: '5 per month', pro: 'Unlimited', biz: 'Unlimited' },
    { label: 'AI Suggestions', free: 'Limited', pro: 'Unlimited', biz: 'Unlimited' },
    { label: 'Cover Letter Builder', free: cross, pro: check, biz: check },
    { label: 'Job Tracker', free: cross, pro: check, biz: check },
    { label: 'Multiple Export Formats', free: 'PDF', pro: 'PDF, DOCX', biz: 'PDF, DOCX' },
    { label: 'Team Management', free: cross, pro: cross, biz: check },
    { label: 'Analytics & Reports', free: cross, pro: cross, biz: check },
    { label: 'Priority Support', free: cross, pro: cross, biz: check },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">Compare Plans</h2>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[600px] text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 font-bold text-slate-900 w-1/4">Features</th>
                <th className="py-4 px-6 font-bold text-slate-900 w-1/4 text-center">Free</th>
                <th className="py-4 px-6 font-bold text-slate-900 w-1/4 text-center bg-green-50/50">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                    Pro
                  </div>
                </th>
                <th className="py-4 px-6 font-bold text-slate-900 w-1/4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                    Business
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-700">{row.label}</td>
                  <td className="py-4 px-6 text-center font-medium text-slate-600">{row.free}</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900 bg-green-50/20">{row.pro}</td>
                  <td className="py-4 px-6 text-center font-medium text-slate-600">{row.biz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    { q: 'Can I cancel my subscription anytime?', a: 'Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your billing cycle.' },
    { q: 'Is there a money-back guarantee?', a: 'We offer a 7-day money-back guarantee for our Pro and Business plans. If you are not satisfied, contact our support team for a full refund.' },
    { q: 'Do you offer discounts for yearly plans?', a: 'Yes! You can save 33% by choosing annual billing instead of monthly billing for our paid plans.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use industry-standard encryption and never sell your personal information to third parties.' },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-6">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Frequently Asked Questions</span>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
              Got Questions? <br />
              We've Got <span className="text-primary">Answers.</span>
            </h2>
            <p className="text-slate-500 font-medium">Everything you need to know about our pricing and plans.</p>
            
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mt-8 relative">
              <HelpCircle className="w-16 h-16 text-primary absolute -left-2 top-2" />
              <div className="w-16 h-12 bg-white rounded-xl shadow-lg border border-slate-100 absolute bottom-4 -right-4 flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-primary/50 shadow-sm"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex items-center justify-between p-5">
                  <h4 className="font-bold text-slate-900 pr-8">{faq.q}</h4>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openIndex === i ? 'rotate-180 text-primary' : ''}`} />
                </div>
                {openIndex === i && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-primary rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Ready to Build Your Dream Resume?</h2>
              <p className="text-green-100 font-medium">Join thousands of successful job seekers and land your dream job.</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-3 w-full md:w-auto">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-50 shadow-xl w-full">
              Get Started Free
            </Button>
            <span className="text-xs font-medium text-green-200">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      <PricingHero />
      <PricingCards />
      <TrustIndicators />
      <CompareTable />
      <FAQSection />
      <CTASection />
    </div>
  )
}
