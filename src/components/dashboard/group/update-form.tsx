"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { SettingsIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  groupUpdateSchemaType,
  groupWithUserSchemaType,
} from "@/lib/group/verification";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { getById, update } from "@/lib/group/actions";
import {
  groupWithUserSchema,
  groupWithUserSchemaDV,
} from "@/lib/group/verification";

interface Props {
  id: string;
  fetchListData: (data: groupWithUserSchemaType) => Promise<void>;
}

export default function GroupUpdateForm(props: Props) {
  const { id, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const form = useForm<groupWithUserSchemaType>({
    resolver: zodResolver(groupWithUserSchema),
    defaultValues: groupWithUserSchemaDV,
  });

  const fetchData = async (id: string) => {
    setIsReady(false);
    const res = await getById({ id: id });
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<groupWithUserSchemaType> = async (
    data: groupUpdateSchemaType,
  ) => {
    const res = await update(data);

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res);
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<groupWithUserSchemaType> = (errors) => {
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
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>グループ編集</SheetTitle>
            <SheetDescription className="sr-only">
              グループ編集画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>グループID</FormLabel>
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
                    <FormLabel>グループ名</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Input type="text" {...field} />
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
                name="createdUser.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>作成者</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {form.getValues("createdUser.displayName")
                          ? form.getValues("createdUser.displayName")
                          : field.value}
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
                          {form.getValues("updatedUser.displayName")
                            ? form.getValues("updatedUser.displayName")
                            : field.value}
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
                    <div
                      hidden={!isReady}
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>作成されていません。</span>
                      )}
                    </div>
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
                name="updatedAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>最終更新日</FormLabel>
                    <div
                      hidden={!isReady}
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>作成されていません。</span>
                      )}
                    </div>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                    />
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
