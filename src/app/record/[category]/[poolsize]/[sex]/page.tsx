import RecordTable from "@/components/record/record-table";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { recordCategory, recordPoolsize, recordSex } from "@/lib/utils";

export async function generateStaticParams() {
  const result = recordCategory
    .map((cateogry) => {
      return recordPoolsize.map((poolsize) => {
        return recordSex.map((sex) => {
          if (
            cateogry.id !== 0 &&
            poolsize.id !== 0 &&
            sex.id !== 0 &&
            sex.id !== 3
          ) {
            return {
              category: cateogry.href,
              poolsize: poolsize.href,
              sex: sex.href,
            };
          } else {
            return undefined;
          }
        });
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
    sex: "men" | "women" | "mixed";
  }>;
}) {
  const { category, poolsize, sex } = await params;
  return (
    <>
      <Header />
      <RecordTable category={category} poolsize={poolsize} sex={sex} />
      <Footer />
    </>
  );
}
