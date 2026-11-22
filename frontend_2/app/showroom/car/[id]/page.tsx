import { redirect } from "next/navigation";

export default async function LegacyCarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/cars/${encodeURIComponent(id)}`);
}
