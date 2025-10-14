import MeetList from "@/components/dashboard/meet/list";
export default async function Page({
  params,
}: {
  params: Promise<{ kind: "swimming" | "diving" | "waterpolo" | "as" | "ow" }>;
}) {
  const { kind } = await params;
  const dt = new Date();
  const thisYear = dt.getFullYear();
  return <MeetList kind={kind} year={thisYear} page={1} />;
}
