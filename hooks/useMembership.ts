import { useSession } from 'next-auth/react';
import { MembershipTier, MembershipFeatures } from '@/lib/types';

const FREE_FEATURES: MembershipFeatures = {
  teamSize: 5,
  storageLimit: 1, // 1GB
  sso: false,
  scim: false,
  audit: false,
  support: false,
  customDomain: false,
  api: false,
  webhook: false,
};

const PRO_FEATURES: MembershipFeatures = {
  teamSize: 20,
  storageLimit: 10, // 10GB
  sso: true,
  scim: false,
  audit: true,
  support: true,
  customDomain: true,
  api: true,
  webhook: true,
};

const ENTERPRISE_FEATURES: MembershipFeatures = {
  teamSize: 100,
  storageLimit: 100, // 100GB
  sso: true,
  scim: true,
  audit: true,
  support: true,
  customDomain: true,
  api: true,
  webhook: true,
};

const MEMBERSHIP_FEATURES: Record<MembershipTier, MembershipFeatures> = {
  free: FREE_FEATURES,
  pro: PRO_FEATURES,
  enterprise: ENTERPRISE_FEATURES,
};

export function useMembership() {
  const { data: session } = useSession();
  const tier = (session?.user?.membershipTier as MembershipTier) || 'free';
  const features = MEMBERSHIP_FEATURES[tier];

  const hasFeature = (feature: keyof MembershipFeatures) => {
    return features[feature];
  };

  const getLimit = (feature: 'teamSize' | 'storageLimit') => {
    return features[feature];
  };

  const isUpgradeRequired = (feature: keyof MembershipFeatures) => {
    return !hasFeature(feature);
  };

  return {
    tier,
    features,
    hasFeature,
    getLimit,
    isUpgradeRequired,
  };
}
