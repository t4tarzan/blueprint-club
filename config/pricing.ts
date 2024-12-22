import { MembershipTier, MEMBERSHIP_FEATURES } from '@/types/membership';

export interface PricingTier {
  id: MembershipTier;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'FREE',
    name: 'Free',
    description: 'Perfect for individuals and small teams getting started',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      'Up to 5 team members',
      'Basic social features',
      '1GB storage',
      'Community support',
      'Basic project management',
    ],
    buttonText: 'Get Started',
  },
  {
    id: 'PRO',
    name: 'Pro',
    description: 'Great for growing teams and organizations',
    price: 29,
    billingPeriod: 'monthly',
    features: [
      'Up to 20 team members',
      'Advanced social features',
      '10GB storage',
      'Priority support',
      'API access',
      'Analytics dashboard',
      'Advanced project management',
      'Custom integrations',
    ],
    highlighted: true,
    buttonText: 'Upgrade to Pro',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'For large organizations requiring advanced features and support',
    price: 99,
    billingPeriod: 'monthly',
    features: [
      '100+ team members',
      'All Pro features',
      '100GB storage',
      'Dedicated support',
      'SSO integration',
      'Custom branding',
      'Advanced security',
      'Audit logs',
      'SLA guarantee',
    ],
    buttonText: 'Contact Sales',
  },
];
