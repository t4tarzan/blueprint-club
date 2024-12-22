export interface Invitation {
  token: string;
  teamId?: string;
  email?: string;
  role?: string;
}

export type InvitationToken = string | null;
