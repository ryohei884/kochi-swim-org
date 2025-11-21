import { auth } from "@/auth";
import SeminarList from "@/components/dashboard/seminar/list";
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

  const approver: Approver = await getApproverList({ categoryLink: "seminar" });

  const dt = new Date();
  const thisYear = dt.getFullYear();
  return (
    <SeminarList
      year={thisYear}
      session={session}
      permission={permission}
      approver={approver}
    />
  );
}
