import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default async function Page({
  params,
}: {
  params: Promise<{
    category: "prefecture" | "high" | "junior_high" | "elementary";
    poolsize: "long" | "short";
  }>;
}) {
  const { category, poolsize } = await params;
  return (
    <>
      <Header />
      <RecordTable category={category} poolsize={poolsize} sex="men" />
      <Footer />
    </>
  );
}
