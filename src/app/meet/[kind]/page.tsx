import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default async function Page({
  params,
}: {
  params: Promise<{ kind: "swimming" | "diving" | "waterpolo" | "as" | "ow" }>;
}) {
  const { kind } = await params;
  const dt = new Date();
  const thisYear = dt.getFullYear();
  return (
    <>
      <Header />
      <MeetList kind={kind} year={thisYear} page={1} />
      <Footer />
    </>
  );
}
