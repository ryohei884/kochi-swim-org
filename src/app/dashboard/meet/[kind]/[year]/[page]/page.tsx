import MeetList from "@/components/dashboard/meet/list";
export default async function Page({
  params,
}: {
  params: Promise<{
    kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
    year: number;
    page: number;
  }>;
}) {
  const { kind, year, page } = await params;
  return <MeetList kind={kind} year={year} page={page} />;
}
