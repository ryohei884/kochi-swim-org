"use client";

import { useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  categoryExcludeSchemaType,
  categoryWithUserSchema,
  categoryWithUserSchemaType,
  categoryWithUserSchemaDV,
} from "@/lib/category/verification";
import { categoryPermission } from "@/lib/permissions";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { getById, exclude } from "@/lib/category/actions";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
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
import { Trash2Icon } from "lucide-react";

interface Props {
  categoryId: string;
  fetchListData: () => Promise<void>;
}

export default function CategoryExcludeForm(props: Props) {
  const { categoryId, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const form = useForm<categoryWithUserSchemaType>({
    resolver: zodResolver(categoryWithUserSchema),
    defaultValues: categoryWithUserSchemaDV,
  });

  const fetchData = async (categoryId: string) => {
    const res = await getById({ categoryId: categoryId });
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogOpen && fetchData(categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<categoryWithUserSchemaType> = async (
    data: categoryExcludeSchemaType,
  ) => {
    await exclude(data);

    toast("削除しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<categoryWithUserSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="ghost" size="sm">
          <Trash2Icon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>カテゴリー削除</SheetTitle>
          <SheetDescription className="sr-only">
            カテゴリー削除画面
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 p-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリID</FormLabel>
                  <FormControl hidden={!isReady}>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value}
                    </div>
                  </FormControl>
                  <Skeleton
                    hidden={isReady}
                    className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ名</FormLabel>
                  <FormControl hidden={!isReady}>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value}
                    </div>
                  </FormControl>
                  <Skeleton
                    hidden={isReady}
                    className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リンク文字列</FormLabel>
                  <FormControl hidden={!isReady}>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value}
                    </div>
                  </FormControl>
                  <Skeleton
                    hidden={isReady}
                    className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>表示順</FormLabel>
                  <FormControl hidden={!isReady}>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value}
                    </div>
                  </FormControl>
                  <Skeleton
                    hidden={isReady}
                    className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>表示設定</FormLabel>
                  <div hidden={!isReady}>
                    <FormControl>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {
                          categoryPermission.find(
                            (v) => v.range === field.value,
                          )?.label
                        }
                      </div>
                    </FormControl>
                  </div>
                  <Skeleton
                    className="flex h-9 items-center justify-end border border-input px-3 py-2 [&amp;&gt;span]:line-clamp-1 w-full"
                    hidden={isReady}
                  >
                    <ChevronDownIcon className="size-4 opacity-50" />
                  </Skeleton>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdUser.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作成者</FormLabel>
                  <FormControl hidden={!isReady}>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value}
                    </div>
                  </FormControl>
                  <Skeleton
                    hidden={isReady}
                    className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("updatedUser.name") ? (
              <FormField
                control={form.control}
                name="updatedUser.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>更新者</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {field.value}
                      </div>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormItem>
                <FormLabel>更新者</FormLabel>
                <FormControl hidden={!isReady}>
                  <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"></div>
                </FormControl>
                <Skeleton
                  hidden={isReady}
                  className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
            )}
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>作成日</FormLabel>
                  <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                    {field.value ? (
                      format(field.value, "PPP", { locale: ja })
                    ) : (
                      <span>作成されていません。</span>
                    )}
                  </div>
                  <Skeleton
                    hidden={isReady}
                    className="w-[240px] pl-3 text-left font-normal flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                  >
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Skeleton>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="updatedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>最終更新日</FormLabel>
                  <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                    {field.value ? (
                      format(field.value, "PPP", { locale: ja })
                    ) : (
                      <span>作成されていません。</span>
                    )}
                  </div>
                  <Skeleton
                    hidden={isReady}
                    className="w-[240px] pl-3 text-left font-normal flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                  >
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Skeleton>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="p-0">
              <Button type="submit">削除</Button>
              <SheetClose asChild>
                <Button variant="outline">キャンセル</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
