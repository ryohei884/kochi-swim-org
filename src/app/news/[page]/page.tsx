import Header from "@/components/top/header";
import News from "@/components/news/guest";
import Footer from "@/components/top/footer";

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  return (
    <>
      <Header />
      <News page={page} />
      <Footer />
    </>
  );
}
