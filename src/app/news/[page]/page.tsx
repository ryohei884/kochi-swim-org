import { get } from "@vercel/edge-config";

import NewsList from "@/components/news/news-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { forRange } from "@/lib/utils";

export async function generateStaticParams() {
  const listNum = await get("news_list_num").then((res) => Number(res));

  const pages: number[] = forRange(1, listNum / 10);

  return pages.map((page) => ({
    page: page.toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: number }>;
}) {
  const { page } = await params;
  return (
    <>
      <Header />
      <NewsList page={page} />
      <Footer />
    </>
  );
}
