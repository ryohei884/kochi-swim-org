import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

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
  return (
    <>
      <Header />
      <MeetList kind={kind} year={year} page={page} />
      <Footer />
    </>
  );
}
