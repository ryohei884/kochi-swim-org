import MeetList from "@/components/dashboard/meet/list";
export default async function Page({
  params,
}: {
  params: Promise<{
    kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
    year: number;
  }>;
}) {
  const { kind, year } = await params;
  return <MeetList kind={kind} year={year} page={1} />;
}
