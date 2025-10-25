import RecordList from "@/components/dashboard/record/list";
export default async function Page({
  params,
}: {
  params: Promise<{
    category: "prefecture" | "high" | "junior_high" | "elementary";
    poolsize: "long" | "short";
    sex: "men" | "women" | "mixed";
  }>;
}) {
  const { category, poolsize, sex } = await params;
  return <RecordList category={category} poolsize={poolsize} sex={sex} />;
}
