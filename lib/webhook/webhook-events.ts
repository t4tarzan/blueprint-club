export const WebhookEvents = {
  team: [
    'team.created',
    'team.updated',
    'team.deleted',
    'member.invited',
    'member.added',
    'member.updated',
    'member.removed',
  ],
  sso: [
    'sso.configured',
    'sso.updated',
    'sso.deleted',
    'sso.login.success',
    'sso.login.failed',
  ],
  scim: [
    'scim.enabled',
    'scim.disabled',
    'scim.user.created',
    'scim.user.updated',
    'scim.user.deleted',
    'scim.group.created',
    'scim.group.updated',
    'scim.group.deleted',
  ],
  subscription: [
    'subscription.created',
    'subscription.updated',
    'subscription.cancelled',
    'subscription.payment.succeeded',
    'subscription.payment.failed',
  ],
  security: [
    'security.api_key.created',
    'security.api_key.deleted',
    'security.login.success',
    'security.login.failed',
    'security.account.locked',
    'security.account.unlocked',
  ],
} as const;

export type WebhookEventType = typeof WebhookEvents[keyof typeof WebhookEvents][number];
