import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getPermissionList } from "@/lib/permission/actions";

// import type { DefaultSession } from "@auth/core/types";

// interface Session {
//   user: {
//     role: "administrator" | "user";
//   } & DefaultSession["user"];
// }

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

// type Props = {
//   session: Session;
//   permission: Permission;
// };

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let permission: Permission = [];
  if (!session || !session?.user.id) {
    return null;
  } else {
    permission = await getPermissionList();
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} permission={permission} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 py-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
