"use client";

import Link from "next/link";
import { CircleUserRound, LogOut, Settings } from "lucide-react";

import { APP_ROUTES } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Signed-in account menu on the avatar — profile / settings / sign out.
 */
export function AvatarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-visible:ring-ring/50 rounded-full focus-visible:ring-[3px] focus-visible:outline-none"
        aria-label="Open account menu"
      >
        <Avatar className="size-9">
          <AvatarImage
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="Sarah Jenkins"
          />
          <AvatarFallback className="bg-brand-soft text-brand text-xs font-semibold">
            SJ
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="min-w-0">
          <p className="text-foreground truncate text-sm font-medium">Sarah Jenkins</p>
          <p className="text-muted-foreground truncate text-xs font-normal">
            sarah.jenkins@adminhub.com
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={APP_ROUTES.PROFILE}>
            <CircleUserRound aria-hidden="true" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/?tab=settings">
            <Settings aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <Link href={APP_ROUTES.LOGIN}>
            <LogOut aria-hidden="true" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
