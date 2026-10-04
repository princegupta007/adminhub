import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

export function RoleFilter({
  value,
  onChange,
  className,
  hidePrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  hidePrefix?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className={className || "bg-card w-[140px]"}
        aria-label="Filter by role"
      >
        {!hidePrefix && <span className="text-muted-foreground">Role:</span>}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function StatusFilter({
  value,
  onChange,
  className,
  hidePrefix,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  hidePrefix?: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        className={className || "bg-card w-[150px]"}
        aria-label="Filter by status"
      >
        {!hidePrefix && <span className="text-muted-foreground">Status:</span>}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="suspended">Suspended</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function ChangeRoleAction() {
  return (
    <Select>
      <SelectTrigger size="sm" className="border-brand/40 bg-card">
        <Check className="text-brand size-3.5" aria-hidden="true" />
        Change Role
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
      </SelectContent>
    </Select>
  );
}
