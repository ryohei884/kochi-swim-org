import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { recordCategory } from "@/lib/utils";

export async function generateStaticParams() {
  const result = recordCategory
    .map((cateogry) => {
      if (cateogry.id !== 0) {
        return {
          category: cateogry.href,
        };
      } else {
        return undefined;
      }
    })
    .flat(Infinity)
    .filter((v) => v !== undefined);
  return result;
}

export default async function Page({
  params,
}: {
  params: Promise<{
    category: "prefecture" | "high" | "junior_high" | "elementary";
  }>;
}) {
  const { category } = await params;
  return (
    <>
      <Header />
      <RecordTable category={category} poolsize="long" sex="men" />
      <Footer />
    </>
  );
}
