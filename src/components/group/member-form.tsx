"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { getDate } from "date-fns";
import { UsersIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { get_member, update_member } from "@/lib/group/actions";

const FormSchema = z.object({
  users: z.array(z.string()),
});

interface Props {
  id: string;
  groupName: string;
  fetchListData: () => Promise<void>;
}

type userListType = {
  name: string;
  id: string;
}[];

export default function MemberForm(props: Props) {
  const { id, fetchListData, groupName } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [userList, setUserList] = useState<userListType>([]);
  const [dataNum, setDataNum] = useState<number>(3);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      users: [],
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    await update_member({ users: data.users, id: id });

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<z.infer<typeof FormSchema>> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  //   const sleep = (ms:number) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchData = async (id: string) => {
    setIsReady(false);
    // await sleep(2000);
    const res = await get_member({ id: id });
    if (res !== null) {
      const users = res.user_list
        .sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt))
        .sort((a, b) => {
          return res.member_list.includes(a.id) ===
            res.member_list.includes(b.id)
            ? 0
            : res.member_list.includes(a.id)
              ? -1
              : 1;
        })
        .map((user) => {
          return {
            name: user.name ? user.name : "",
            id: user.id,
          };
        });
      setUserList(users);
      setDataNum(users.length);
      form.reset({ users: res.member_list });
      setIsReady(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="ghost" size="sm">
          <UsersIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>メンバー編集</SheetTitle>
            <SheetDescription className="sr-only">
              メンバー編集画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="users"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{groupName}</FormLabel>
                      <FormDescription>
                        メンバーに加入させる人をチェックしてください。
                      </FormDescription>
                    </div>
                    {!isReady
                      ? (function () {
                          const rows = [];
                          for (let i = 0; i < dataNum; i++) {
                            rows.push(
                              <Skeleton
                                key={i}
                                className="flex h-5 w-full border border-input p-2 file:border-0 max-w-full"
                              />,
                            );
                          }
                          return <>{rows}</>;
                        })()
                      : userList.map((user) => (
                          <FormField
                            key={user.id}
                            control={form.control}
                            name="users"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={user.id}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(user.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              user.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== user.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {user.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="p-0">
                <Button type="submit" disabled={!isReady}>
                  更新
                </Button>
                <SheetClose asChild>
                  <Button variant="outline">キャンセル</Button>
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
