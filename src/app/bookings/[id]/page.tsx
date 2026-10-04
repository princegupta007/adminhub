import { BookingDetailView } from "@/features/bookings/components/booking-detail-view";

export const metadata = {
  title: "Booking Details",
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetailView id={id} />;
}
