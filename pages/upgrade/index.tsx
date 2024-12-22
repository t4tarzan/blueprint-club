import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PRICING_TIERS } from '@/config/pricing';
import { useMembership } from '@/hooks/useMembership';

export default function UpgradePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { tier: currentTier } = useMembership();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleUpgrade = async (tierId: string) => {
    if (tierId === 'ENTERPRISE') {
      // Open contact form or redirect to sales page
      window.location.href = 'mailto:sales@blueprintclub.com?subject=Enterprise Plan Inquiry';
      return;
    }

    // TODO: Implement payment flow
    console.log('Upgrading to:', tierId, 'with billing period:', billingPeriod);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Upgrade Your Blueprint Club Experience
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your team
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-green-600 text-xs">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const price = billingPeriod === 'yearly' 
              ? Math.floor(tier.price * 12 * 0.8) 
              : tier.price;

            return (
              <Card
                key={tier.id}
                className={`flex flex-col ${
                  tier.highlighted
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-gray-200'
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tier.name}</span>
                    {isCurrentTier && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Current Plan
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-500">/{billingPeriod}</span>
                  </div>
                  <p className="mt-4 text-gray-500">{tier.description}</p>
                  <ul className="mt-6 space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrentTier}
                    className={`w-full py-2 px-4 rounded-md ${
                      isCurrentTier
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : tier.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-gray-800 text-white hover:bg-gray-900'
                    }`}
                  >
                    {isCurrentTier ? 'Current Plan' : tier.buttonText}
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in the free plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  The free plan includes basic social features, project management for up to 5 team members,
                  and 1GB of storage. Perfect for individuals and small teams getting started.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade at any time?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Yes! You can upgrade at any time. Downgrades will take effect at the end of your current billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Yes, we offer a 30-day money-back guarantee for all paid plans.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-20">
          <Card className="bg-gray-900 text-white">
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Need help choosing?</h2>
                <p className="mt-4">
                  Our team is here to help you find the perfect plan for your needs.
                </p>
                <a
                  href="mailto:support@blueprintclub.com"
                  className="mt-6 inline-block px-6 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
