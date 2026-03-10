import NewsItem from "@/components/news/news-item";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { getListAll } from "@/lib/news/actions";

type res = {
  id: string;
  title: string;
  detail: string;
  image: string | null;
  fromDate: Date;
  toDate: Date | null;
  linkCategory: number | null;
  linkString: string | null;
  order: number;
  createdUserId: string;
  revisedUserId: string | null;
  approvedUserId: string | null;
  approved: boolean;
  createdAt: Date;
  revisedAt: Date;
  approvedAt: Date | null;
}[];

export async function generateStaticParams() {
  const posts: res = await getListAll();

  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Header />
      <NewsItem id={id} />
      <Footer />
    </>
  );
}
