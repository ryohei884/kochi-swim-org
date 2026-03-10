import MeetList from "@/components/meet/meet-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { meetKind } from "@/lib/utils";

export async function generateStaticParams() {
  const result = meetKind
    .map((kind) => {
      return {
        kind: kind.href,
      };
    })
    .flat(Infinity)
    .filter((v) => v !== undefined);

  return result;
}

export default async function Page({
  params,
}: {
  params: Promise<{ kind: "swimming" | "diving" | "waterpolo" | "as" | "ow" }>;
}) {
  const { kind } = await params;
  const dt = new Date();
  const thisYear =
    dt.getMonth() <= 3 && dt.getDate() <= 31
      ? dt.getFullYear() - 1
      : dt.getFullYear();
  return (
    <>
      <Header />
      <MeetList kind={kind} year={thisYear} />
      <Footer />
    </>
  );
}
