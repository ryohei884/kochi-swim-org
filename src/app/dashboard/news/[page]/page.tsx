import NewsList from "@/components/dashboard/news/list";
import { getPermissionList } from "@/lib/permission/actions";

import { auth } from "@/auth";

type Permission = {
  categoryId: string;
  categoryName: string;
  categoryLink: string;
  view: boolean;
  submit: boolean;
  revise: boolean;
  exclude: boolean;
  approve: boolean;
}[];

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const session = await auth();
  let permission: Permission = [];

  if (!session?.user.id) {
    return null;
  } else {
    permission = await getPermissionList();
  }

  return <NewsList page={page} session={session} permission={permission} />;
}
