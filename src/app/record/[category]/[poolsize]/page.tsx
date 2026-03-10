import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { recordCategory, recordPoolsize } from "@/lib/utils";

export async function generateStaticParams() {
  const result = recordCategory
    .map((cateogry) => {
      return recordPoolsize.map((poolsize) => {
        if (cateogry.id !== 0 && poolsize.id !== 0) {
          return {
            category: cateogry.href,
            poolsize: poolsize.href,
          };
        } else {
          return undefined;
        }
      });
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
