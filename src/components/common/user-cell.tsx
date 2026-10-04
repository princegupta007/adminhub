import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/formatters";

interface UserCellProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  subtitle?: string;
  className?: string;
}

/** Avatar + name (used across all data tables). */
export function UserCell({
  firstName,
  lastName,
  avatarUrl,
  subtitle,
  className,
}: UserCellProps) {
  const name = `${firstName} ${lastName}`;
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Avatar className="size-8">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" aria-hidden="true" /> : null}
        <AvatarFallback className="bg-brand-soft text-brand text-[11px] font-semibold">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 leading-tight">
        <p className="text-foreground truncate text-sm font-medium">{name}</p>
        {subtitle ? (
          <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
