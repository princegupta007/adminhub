import { UserDetailView } from "@/features/users/components/user-detail-view";

export const metadata = {
  title: "User Details",
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailView id={Number(id)} />;
}
