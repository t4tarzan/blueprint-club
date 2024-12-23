import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useMembership } from '@/hooks/useMembership';

export default function UpgradePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const membership = useMembership();

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="mb-4">Please sign in to view pricing plans.</p>
          <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
        </Card>
      </div>
    );
  }

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for small teams and personal projects',
      price: '$0',
      features: [
        `Up to ${membership?.features.teamSize} team members`,
        `${membership?.features.storageLimit}GB storage`,
        'Basic support',
      ],
      current: membership?.tier === 'free',
    },
    {
      name: 'Pro',
      description: 'Great for growing teams with advanced needs',
      price: '$49',
      features: [
        'Up to 20 team members',
        '10GB storage',
        'SSO authentication',
        'Audit logs',
        'API access',
        'Webhook integration',
        'Priority support',
      ],
      current: membership?.tier === 'pro',
    },
    {
      name: 'Enterprise',
      description: 'For large organizations requiring maximum control',
      price: 'Contact us',
      features: [
        'Unlimited team members',
        '100GB storage',
        'SSO + SCIM',
        'Advanced audit logs',
        'Custom domain',
        'API access',
        'Webhook integration',
        'Dedicated support',
      ],
      current: membership?.tier === 'enterprise',
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade Your Plan</h1>
        <p className="text-xl text-gray-600">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold">{plan.price}</div>
              {plan.price !== 'Contact us' && <span>/month</span>}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.current ? 'secondary' : 'default'}
              disabled={plan.current}
            >
              {plan.current
                ? 'Current Plan'
                : plan.name === 'Enterprise'
                ? 'Contact Sales'
                : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
