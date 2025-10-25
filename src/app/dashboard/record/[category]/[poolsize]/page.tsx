import RecordList from "@/components/dashboard/record/list";
export default async function Page({
  params,
}: {
  params: Promise<{
    category: "prefecture" | "high" | "junior_high" | "elementary";
    poolsize: "long" | "short";
  }>;
}) {
  const { category, poolsize } = await params;
  return <RecordList category={category} poolsize={poolsize} sex="men" />;
}
