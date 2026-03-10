import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { meetKind, years } from "@/lib/utils";

export async function generateStaticParams() {
  const result = meetKind
    .map((kind) => {
      return years.map((year) => {
        return {
          kind: kind.href,
          year: year.toString(),
        };
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
    year: number;
    kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
  }>;
}) {
  const { kind, year } = await params;
  return (
    <>
      <Header />
      <MeetList kind={kind} year={year} />
      <Footer />
    </>
  );
}
