export type UserStatus = "active" | "inactive" | "suspended";
export type UserRole = "Admin" | "Editor" | "Viewer";
export type UserSortField =
  "name" | "email" | "joinDate" | "lastActive" | "status" | "role";

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  gender: "male" | "female";
  age: number;
  city: string;
  country: string;
  companyName: string;
  jobTitle: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastActive: string;
}

export interface UserDetails extends UserSummary {
  username: string;
  birthDate: string;
  bloodGroup: string;
  university: string;
  addressLine: string;
  state: string;
  eyeColor: string;
  hair: { color: string; type: string };
  height: number;
  weight: number;
  bank: {
    cardType: string;
    cardNumber: string;
    cardExpire: string;
    currency: string;
  };
}
