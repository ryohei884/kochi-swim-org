import SeminarList from "@/components/seminar/seminar-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { years } from "@/lib/utils";

export async function generateStaticParams() {
  const result = years
    .map((year) => {
      return {
        year: year.toString(),
      };
    })
    .flat(Infinity)
    .filter((v) => v !== undefined);

  console.log("seminar: ", result);
  return result;
}

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
