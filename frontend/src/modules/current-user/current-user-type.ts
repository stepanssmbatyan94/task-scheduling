export type UserProfile = {
  id: number | string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: {
    id: number | string;
    path?: string;
  } | null;
  role?: {
    id: number | string;
    name?: string;
  } | null;
  status?: {
    id: number | string;
    name?: string;
  } | null;
};

export type CurrentUser = {
  user?: UserProfile | null;
  authorities: string[];
};
