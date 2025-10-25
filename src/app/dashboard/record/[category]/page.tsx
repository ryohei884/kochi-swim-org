import RecordList from "@/components/dashboard/record/list";
export default async function Page({
  params,
}: {
  params: Promise<{
    category: "prefecture" | "high" | "junior_high" | "elementary";
  }>;
}) {
  const { category } = await params;
  return <RecordList category={category} poolsize="long" sex="men" />;
}
