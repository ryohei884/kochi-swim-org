import NewsList from "@/components/news/news-list";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
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
