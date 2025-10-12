import LiveList from "@/components/dashboard/live/list";
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <LiveList page={page} />;
}
