export const passwordPolicies = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export const maxLengthPolicies = {
  name: 100,
  email: 255,
  password: 100,
  team: 50,
};

export const defaultHeaders = {
  'Content-Type': 'application/json',
};
