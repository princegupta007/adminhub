import { Suspense } from "react";

import { UsersView } from "@/features/users/components/users-view";

export const metadata = {
  title: "Users",
};

export default function UsersPage() {
  return (
    <Suspense>
      <UsersView />
    </Suspense>
  );
}
