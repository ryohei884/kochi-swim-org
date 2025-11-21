"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderKey } from "lucide-react";
import { useEffect, useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getList } from "@/lib/category/actions";
import type { categoryWithUserSchemaType } from "@/lib/category/verification";
import { get_permission, update_permission } from "@/lib/group/actions";
import type { permissionUpdateSchemaType } from "@/lib/group/verification";
import {
  permissionUpdateSchema,
  permissionUpdateSchemaDV,
} from "@/lib/group/verification";

interface Props {
  id: string;
  groupName: string;
  fetchListData: () => Promise<void>;
}

export default function PermissionForm(props: Props) {
  const { id, fetchListData, groupName } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(3);
  const [categoryList, setCategoryList] = useState<
    categoryWithUserSchemaType[]
  >([]);

  const form = useForm<permissionUpdateSchemaType>({
    resolver: zodResolver(permissionUpdateSchema),
    defaultValues: permissionUpdateSchemaDV,
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof permissionUpdateSchema>
  > = async (data: permissionUpdateSchemaType) => {
    console.log(data);
    update_permission(data);

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<permissionUpdateSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  //   const sleep = (ms: number) =>
  //     new Promise((resolve) => setTimeout(resolve, ms));

  const fetchData = async (id: string) => {
    setIsReady(false);
    // await sleep(2000);
    const res = await getList();
    const res2 = await get_permission({ groupId: id });
    let data: permissionUpdateSchemaType = { data: [] };

    if (res !== null) {
      setCategoryList(res);
      const d = res.map((c) => {
        let view = false;
        let submit = false;
        let revise = false;
        let exclude = false;
        let approve = false;
        const p = res2.permission_list.find((p) => p.categoryId === c.id);
        if (p !== undefined) {
          view = p.view;
          submit = p.submit;
          revise = p.revise;
          exclude = p.exclude;
          approve = p.approve;
        }
        return {
          groupId: id,
          categoryId: c.id,
          permission: [
            view ? "view" : null,
            submit ? "submit" : null,
            revise ? "revise" : null,
            exclude ? "exclude" : null,
            approve ? "approve" : null,
          ]
            .filter((v) => Boolean(v))
            .concat([]),
        };
      });
      data = { data: d };

      setDataNum(res.length);
      form.reset(data);

      setIsReady(true);
    }
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const p_cat = ["view", "submit", "revise", "exclude", "approve"];

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="ghost" size="sm">
          <FolderKey />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>権限編集</SheetTitle>
            <SheetDescription className="sr-only">
              権限編集画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="data"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">{groupName}</FormLabel>
                      <FormDescription>
                        与える権限をチェックしてください。
                      </FormDescription>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>カテゴリ名</TableHead>
                          <TableHead className="text-center">閲覧</TableHead>
                          <TableHead className="text-center">作成</TableHead>
                          <TableHead className="text-center">修正</TableHead>
                          <TableHead className="text-center">削除</TableHead>
                          <TableHead className="text-center">承認</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!isReady
                          ? (function () {
                              const rows = [];
                              for (let i = 0; i < dataNum; i++) {
                                rows.push(
                                  <TableRow key={i}>
                                    <TableCell className="font-medium">
                                      <Skeleton
                                        key={i}
                                        className="flex h-5 w-full border border-input p-2 file:border-0 max-w-full"
                                      />
                                    </TableCell>
                                    {p_cat.map((cat) => {
                                      return (
                                        <TableCell
                                          key={`${i}_${cat}`}
                                          className="justify-items-center"
                                        >
                                          <Skeleton
                                            key={i}
                                            className="flex size-4 border border-input max-w-full rounded-[4px]"
                                          />
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>,
                                );
                              }
                              return <>{rows}</>;
                            })()
                          : categoryList.map((c, ci) => {
                              return (
                                <TableRow key={c.id}>
                                  <TableCell className="font-medium">
                                    {c.name}
                                  </TableCell>
                                  {p_cat.map((cat) => {
                                    return (
                                      <TableCell
                                        key={`${c.id}_${cat}`}
                                        className="justify-items-center"
                                      >
                                        <FormField
                                          control={form.control}
                                          name={`data.${ci}.permission`}
                                          render={({ field }) => {
                                            return (
                                              <FormItem>
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(
                                                      cat,
                                                    )}
                                                    onCheckedChange={(
                                                      checked,
                                                    ) => {
                                                      return checked
                                                        ? field.onChange(
                                                            field.value !== null
                                                              ? [
                                                                  ...field.value,
                                                                  cat,
                                                                ]
                                                              : [cat],
                                                          )
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) =>
                                                                value !== cat,
                                                            ),
                                                          );
                                                    }}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                      </TableBody>
                    </Table>
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
