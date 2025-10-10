import MeetList from "@/components/dashboard/meet/list";
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <MeetList page={page} />;
}
