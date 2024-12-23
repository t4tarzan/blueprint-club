import type { User, Team, TeamMember, Invitation, Role } from '@prisma/client';

// Base serialized types for date fields
type SerializedDate = string;
type WithSerializedDates<T> = {
  [K in keyof T]: T[K] extends Date | null
    ? SerializedDate | null
    : T[K] extends Date
    ? SerializedDate
    : T[K];
};

// Serialized User type
export interface SerializedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: SerializedDate | null;
  membershipTier: string;
  teams: {
    id: string;
    name: string;
    slug: string;
    role: Role;
  }[];
}

// Serialized TeamMember type with user
export interface SerializedTeamMember {
  id: string;
  role: Role;
  user: SerializedUser;
}

// Serialized Invitation type with inviter
export interface SerializedInvitation {
  id: string;
  email: string;
  role: Role;
  token: string;
  expires: SerializedDate;
  team: SerializedTeam;
}

// Serialized Team type with members and invitations
export interface SerializedTeam {
  id: string;
  name: string;
  slug: string;
  createdAt: SerializedDate;
  updatedAt: SerializedDate;
  members: SerializedTeamMember[];
  invitations: SerializedInvitation[];
}

// Helper function to serialize dates in an object
export function serializeDates<T>(obj: T): WithSerializedDates<T> {
  if (!obj) return obj as WithSerializedDates<T>;

  const serialized = { ...obj };
  for (const key in serialized) {
    const value = serialized[key];
    if (value instanceof Date) {
      (serialized as any)[key] = value.toISOString();
    } else if (value && typeof value === 'object') {
      (serialized as any)[key] = serializeDates(value);
    }
  }
  return serialized as WithSerializedDates<T>;
}

// Helper function to parse dates in an object
export function parseDates<T>(obj: WithSerializedDates<T>): T {
  if (!obj) return obj as T;

  const parsed = { ...obj };
  for (const key in parsed) {
    const value = parsed[key];
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      (parsed as any)[key] = new Date(value);
    } else if (value && typeof value === 'object') {
      (parsed as any)[key] = parseDates(value);
    }
  }
  return parsed as T;
}
