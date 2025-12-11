import SeminarList from "@/components/seminar/seminar-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default async function Page({
  params,
}: {
  params: Promise<{ year: number }>;
}) {
  const { year } = await params;
  return (
    <>
      <Header />
      <SeminarList year={year} />
      <Footer />
    </>
  );
}
