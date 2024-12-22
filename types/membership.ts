export type MembershipTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface MembershipFeatures {
  socialAccess: boolean;
  projectCreation: boolean;
  teamSize: number;
  storageLimit: number; // in GB
  analyticsAccess: boolean;
  apiAccess: boolean;
  customBranding: boolean;
  ssoSupport: boolean;
  priority: boolean;
}

export const MEMBERSHIP_FEATURES: Record<MembershipTier, MembershipFeatures> = {
  FREE: {
    socialAccess: true,
    projectCreation: true,
    teamSize: 5,
    storageLimit: 1,
    analyticsAccess: false,
    apiAccess: false,
    customBranding: false,
    ssoSupport: false,
    priority: false,
  },
  PRO: {
    socialAccess: true,
    projectCreation: true,
    teamSize: 20,
    storageLimit: 10,
    analyticsAccess: true,
    apiAccess: true,
    customBranding: false,
    ssoSupport: false,
    priority: true,
  },
  ENTERPRISE: {
    socialAccess: true,
    projectCreation: true,
    teamSize: 100,
    storageLimit: 100,
    analyticsAccess: true,
    apiAccess: true,
    customBranding: true,
    ssoSupport: true,
    priority: true,
  },
};
