export interface Team {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  samlConfig?: any;  // JSON type
  scimToken?: string | null;
}
