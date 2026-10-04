"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";

/**
 * Row-level actions for the users table.
 */
export function UserRowActions() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center justify-end gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-muted size-8 rounded-full"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="bg-danger-soft text-danger hover:bg-danger/20 size-8 rounded-full"
          onClick={() => setEditOpen(true)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <ComingSoonDialog open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
