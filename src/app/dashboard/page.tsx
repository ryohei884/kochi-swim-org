import Account from "@/components/dashboard/account/account";
import PC from "@/components/dashboard/account/permission-control";
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

export default async function Page() {
  const session = await auth();
  let permission: Permission = [];

  if (!session?.user.id) {
    return null;
  } else {
    permission = await getPermissionList();
  }

  return (
    <>
      <Account />
      <PC permission={permission} />
    </>
  );
}
