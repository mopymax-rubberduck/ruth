
export interface UserProfile {
  uid: string;
  email: string;
  createdAt: number; // Date.now()
  displayName?: string;
}

export interface NewUserForm {
  email: string;
  password: string;
  displayName?: string;
}
