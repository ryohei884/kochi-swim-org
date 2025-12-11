import { auth } from "@/auth";
import NewsList from "@/components/dashboard/news/list";
import { getApproverList, getPermissionList } from "@/lib/permission/actions";

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

type Approver = {
  userId: string;
  userDisplayName: string | null;
  userName: string | null;
}[];

export default async function Page() {
  const session = await auth();
  let permission: Permission = [];

  if (!session?.user.id) {
    return null;
  } else {
    permission = await getPermissionList();
  }

  const approver: Approver = await getApproverList({ categoryLink: "news" });

  return (
    <NewsList
      page={1}
      session={session}
      permission={permission}
      approver={approver}
    />
  );
}
