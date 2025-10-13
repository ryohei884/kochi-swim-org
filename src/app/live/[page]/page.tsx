import LiveList from "@/components/live/live-list";
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
      <LiveList page={page} />
      <Footer />
    </>
  );
}
