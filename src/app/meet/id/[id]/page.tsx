import MeetItem from "@/components/meet/meet-item";
import Footer from "@/components/top/footer";
import Header from "@/components/top/header";
import { getListAll } from "@/lib/meet/actions";

type res = {
  id: string;
  code: string | null;
  kind: number;
  fromDate: Date;
  toDate: Date | null;
  title: string;
  deadline: Date | null;
  place: string;
  poolsize: number;
  result: boolean;
  description: string | null;
  detail: string | null;
  attachment: string | null;
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
      <MeetItem id={id} />
      <Footer />
    </>
  );
}
