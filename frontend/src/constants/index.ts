// ============================================================
// APP CONSTANTS
// ============================================================

export const APP = {
  name:        'ResumeAI',
  tagline:     'Build ATS-Optimized Resumes with AI',
  description: 'The most powerful AI resume builder. Beat ATS filters, land more interviews.',
  url:         'https://resumeai.io',
  version:     '1.0.0',
} as const

// ── Routes ──────────────────────────────────────────────────
export const ROUTES = {
  HOME:       '/',
  ABOUT:      '/about',
  FEATURES:   '/features',
  PRICING:    '/pricing',
  TEMPLATES:  '/templates',
  LOGIN:      '/login',
  REGISTER:   '/register',
  DASHBOARD:  '/dashboard',
  NOT_FOUND:  '/404',
} as const

// ── Navigation ───────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'About',     href: ROUTES.ABOUT     },
  { label: 'Features',  href: ROUTES.FEATURES  },
  { label: 'Pricing',   href: ROUTES.PRICING   },
] as const

// ── Theme ─────────────────────────────────────────────────────
export const THEME_STORAGE_KEY = 'resumeai_theme'

// ── Breakpoints ──────────────────────────────────────────────
export const BREAKPOINTS = {
  xs:  475,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  '2xl': 1536,
} as const

// ── Animation delays ─────────────────────────────────────────
export const STAGGER_DELAY = 0.08
export const BASE_DURATION = 0.45

// ── Pricing ──────────────────────────────────────────────────
export const PRICING_PLANS = [
  {
    id:          'free',
    name:        'Free',
    price:       0,
    period:      'forever',
    description: 'Perfect to get started',
    badge:       null,
    highlighted: false,
    features: [
      '1 Active Resume',
      '5 Basic Templates',
      'PDF Download',
      'ATS Compatibility Check',
      'Real-time Preview',
    ],
    cta: 'Get Started Free',
  },
  {
    id:          'pro',
    name:        'Pro',
    price:       12,
    period:      'month',
    description: 'Most popular for job seekers',
    badge:       'Most Popular',
    highlighted: true,
    features: [
      'Unlimited Resumes',
      '50+ Premium Templates',
      'AI Content Generation',
      'Advanced ATS Optimizer',
      'Cover Letter Builder',
      'LinkedIn Profile Import',
      'Priority Support',
      'Custom Domains',
    ],
    cta: 'Start 7-Day Trial',
  },
  {
    id:          'enterprise',
    name:        'Enterprise',
    price:       49,
    period:      'month',
    description: 'For teams & organizations',
    badge:       null,
    highlighted: false,
    features: [
      'Everything in Pro',
      'Team Collaboration',
      'Branded Templates',
      'API Access',
      'Analytics Dashboard',
      'SSO / SAML',
      'Dedicated CSM',
      'SLA Guarantee',
    ],
    cta: 'Contact Sales',
  },
] as const

// ── Stats ─────────────────────────────────────────────────────
export const STATS = [
  { value: '2.4M+',  label: 'Resumes Built'  },
  { value: '94%',    label: 'Interview Rate'  },
  { value: '680K+',  label: 'Jobs Landed'     },
  { value: '4.9★',   label: 'Average Rating'  },
] as const

// ── Trusted Companies ─────────────────────────────────────────
export const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple',
  'Meta', 'Netflix', 'Stripe', 'Spotify', 'Figma', 'Notion',
] as const

// ── How It Works ─────────────────────────────────────────────
export const HOW_IT_WORKS = [
  {
    step:        '01',
    title:       'Enter Your Details',
    description: 'Fill in your experience, skills, and education with our intuitive guided editor.',
  },
  {
    step:        '02',
    title:       'AI Optimizes Content',
    description: 'Our AI rewrites your bullet points and tailors your resume to match the job description.',
  },
  {
    step:        '03',
    title:       'ATS Score & Export',
    description: 'Get a real-time ATS compatibility score, then download as PDF or share a live link.',
  },
] as const

// ── Features ─────────────────────────────────────────────────
export const FEATURES_LIST = [
  {
    icon:        'Sparkles',
    title:       'AI Content Generation',
    description: 'Generate professional bullet points, summaries, and skill sets tailored to any job in seconds.',
    color:       'primary',
  },
  {
    icon:        'Target',
    title:       'ATS Score Optimizer',
    description: 'Analyze your resume against any job description and get a live ATS compatibility score.',
    color:       'secondary',
  },
  {
    icon:        'Layout',
    title:       '50+ Premium Templates',
    description: 'Recruiter-approved, ATS-friendly templates crafted by top designers.',
    color:       'primary',
  },
  {
    icon:        'Zap',
    title:       'Real-time Preview',
    description: 'See your resume update live as you type — no lag, no refresh.',
    color:       'secondary',
  },
  {
    icon:        'Download',
    title:       'One-Click Export',
    description: 'Export as PDF, DOCX, or plain text. Share a shareable live link instantly.',
    color:       'primary',
  },
  {
    icon:        'BarChart2',
    title:       'Application Analytics',
    description: 'Track applications, responses, and interviews all in one intelligent dashboard.',
    color:       'secondary',
  },
] as const

// ── Testimonials ─────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id:       1,
    name:     'Sarah Chen',
    role:     'Software Engineer',
    company:  'Google',
    initials: 'SC',
    rating:   5,
    content:  'ResumeAI completely transformed my job search. I went from zero callbacks to 5 interviews within the first week.',
  },
  {
    id:       2,
    name:     'Marcus Johnson',
    role:     'Product Manager',
    company:  'Microsoft',
    initials: 'MJ',
    rating:   5,
    content:  'The ATS optimizer finally explained why my applications were being rejected. After fixing it, I got 3 offers in a month.',
  },
  {
    id:       3,
    name:     'Priya Patel',
    role:     'Data Scientist',
    company:  'Netflix',
    initials: 'PP',
    rating:   5,
    content:  "I landed my dream job at Netflix after using ResumeAI. The AI suggestions were shockingly accurate and professional.",
  },
  {
    id:       4,
    name:     'Alex Rivera',
    role:     'UX Designer',
    company:  'Stripe',
    initials: 'AR',
    rating:   5,
    content:  'The templates are stunning. My resume finally looks as good as my portfolio. Best investment I made in my career.',
  },
  {
    id:       5,
    name:     'Jordan Kim',
    role:     'Backend Engineer',
    company:  'Figma',
    initials: 'JK',
    rating:   5,
    content:  "I was skeptical about AI resume tools, but ResumeAI changed my mind. It's intuitive, fast, and actually works.",
  },
  {
    id:       6,
    name:     'Emma Williams',
    role:     'Marketing Lead',
    company:  'Notion',
    initials: 'EW',
    rating:   5,
    content:  'The cover letter generator saved me hours per application. I got a 400% better response rate within 2 weeks.',
  },
] as const

// ── FAQ ───────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  {
    q: 'What is an ATS and why does it matter?',
    a: 'ATS (Applicant Tracking System) is software 99% of Fortune 500 companies use to filter resumes before any human reads them. Our optimizer ensures your resume passes every filter.',
  },
  {
    q: 'How does the AI content generation work?',
    a: 'Our AI analyzes your experience and the target job description to generate compelling, keyword-rich bullet points trained on millions of successful resumes.',
  },
  {
    q: 'Can I export my resume in multiple formats?',
    a: 'Yes — PDF, DOCX, plain text, and a shareable live link that updates in real time.',
  },
  {
    q: 'Is my personal data secure?',
    a: 'Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. We never sell or share your data.',
  },
  {
    q: 'Do you offer a free plan?',
    a: 'Yes! Our free plan includes 1 resume, 5 templates, PDF export, and ATS checking. No credit card required.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, cancel anytime with zero fees. Your data remains accessible even after cancellation.',
  },
  {
    q: 'Do you support multiple languages?',
    a: 'Currently we support English fully, with Spanish, French, German, and Portuguese in beta.',
  },
  {
    q: 'What makes ResumeAI different from other builders?',
    a: "We're the only tool combining real-time ATS scoring, AI content generation, and premium design — all in one product.",
  },
] as const

// ── Social Links ──────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { name: 'Twitter',   href: 'https://twitter.com',   icon: 'Twitter'   },
  { name: 'LinkedIn',  href: 'https://linkedin.com',  icon: 'Linkedin'  },
  { name: 'GitHub',    href: 'https://github.com',    icon: 'Github'    },
  { name: 'YouTube',   href: 'https://youtube.com',   icon: 'Youtube'   },
] as const

// ── Footer Links ──────────────────────────────────────────────
export const FOOTER_LINKS = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features',   href: '/features'  },
      { label: 'Templates',  href: '/templates' },
      { label: 'Pricing',    href: '/pricing'   },
      { label: 'Changelog',  href: '#'          },
      { label: 'Roadmap',    href: '#'          },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About',     href: '/about' },
      { label: 'Blog',      href: '#'      },
      { label: 'Careers',   href: '#'      },
      { label: 'Press',     href: '#'      },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'API Docs',    href: '#' },
      { label: 'Status',      href: '#' },
      { label: 'Community',   href: '#' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy',  href: '#' },
      { label: 'Terms',    href: '#' },
      { label: 'Cookies',  href: '#' },
      { label: 'GDPR',     href: '#' },
    ],
  },
} as const
