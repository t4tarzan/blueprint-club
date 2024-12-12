export interface Profile {
  id: string;
  bio?: string;
  location?: string;
  website?: string;
  occupation?: string;
  interests?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
