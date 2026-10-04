import Link from "next/link";
import { UserX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { APP_ROUTES } from "@/lib/constants";

export default function UserNotFound() {
  return (
    <div className="bg-background flex min-h-svh items-center justify-center">
      <div className="w-full max-w-lg">
        <EmptyState
          icon={UserX}
          title="User not found"
          description="The user you're looking for doesn't exist or may have been removed."
        />
        <div className="flex justify-center">
          <Button asChild variant="outline" size="sm">
            <Link href={APP_ROUTES.USERS}>Back to Users</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
