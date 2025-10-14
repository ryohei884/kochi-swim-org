import MeetList from "@/components/dashboard/meet/list";
export default function Page() {
  const dt = new Date();
  const thisYear = dt.getFullYear();
  return <MeetList kind="swimming" year={thisYear} page={1} />;
}
