import type { ReactNode } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileFilterDrawerProps {
  children: ReactNode;
}

export function MobileFilterDrawer({ children }: MobileFilterDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="bg-card shrink-0">
          <Filter className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-8">
        <SheetHeader className="mb-2 px-4 pt-4 text-left">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 px-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
