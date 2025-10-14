import NewsList from "@/components/dashboard/news/list";
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <NewsList page={page} />;
}
