import SeminarList from "@/components/dashboard/seminar/list";
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return <SeminarList page={page} />;
}
