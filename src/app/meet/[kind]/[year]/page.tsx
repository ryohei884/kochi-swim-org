import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default async function Page({
  params,
}: {
  params: Promise<{
    year: number;
    kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  }>;
}) {
  const { kind, year } = await params;
  return (
    <>
      <Header />
      <MeetList kind={kind} year={year} page={1} />
      <Footer />
    </>
  );
}
