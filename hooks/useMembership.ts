import { useSession } from 'next-auth/react';
import { MEMBERSHIP_FEATURES, type MembershipFeatures } from '@/types/membership';

export function useMembership() {
  const { data: session } = useSession();
  const membershipTier = session?.user?.membershipTier || 'FREE';
  const features = MEMBERSHIP_FEATURES[membershipTier];

  const hasFeature = (feature: keyof MembershipFeatures): boolean => {
    return features[feature] || false;
  };

  const getLimit = (feature: 'teamSize' | 'storageLimit'): number => {
    return features[feature];
  };

  return {
    tier: membershipTier,
    features,
    hasFeature,
    getLimit,
    isUpgradeRequired: (feature: keyof MembershipFeatures) => !hasFeature(feature),
  };
}
