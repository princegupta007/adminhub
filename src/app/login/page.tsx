import type { Metadata } from "next";

import { LoginView } from "@/features/auth/components/login-view";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginView />;
}
