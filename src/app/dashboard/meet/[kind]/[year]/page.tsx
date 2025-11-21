import { auth } from "@/auth";
import MeetList from "@/components/dashboard/meet/list";
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

export default async function Page({
  params,
}: {
  params: Promise<{
    kind: "swimming" | "diving" | "waterpolo" | "as" | "ow";
    year: number;
  }>;
}) {
  const { kind, year } = await params;
  const session = await auth();
  let permission: Permission = [];

  if (!session?.user.id) {
    return null;
  } else {
    permission = await getPermissionList();
  }

  const approver: Approver = await getApproverList({ categoryLink: "meet" });

  return (
    <MeetList
      kind={kind}
      year={year}
      page={1}
      session={session}
      permission={permission}
      approver={approver}
    />
  );
}
