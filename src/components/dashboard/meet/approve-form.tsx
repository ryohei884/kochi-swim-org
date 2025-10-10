"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { ExternalLink, Stamp } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { getById, approve } from "@/lib/meet/actions";
import {
  meetWithUserSchemaDV,
  meetWithUserSchema,
} from "@/lib/meet/verification";
import type {
  meetApproveSchemaType,
  meetWithUserSchemaType,
} from "@/lib/meet/verification";
import { meetKind, poolSize } from "@/lib/utils";

interface Props {
  id: string;
  fetchListData: () => Promise<void>;
}

export default function MeetApproveForm(props: Props) {
  const { id, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const form = useForm<meetWithUserSchemaType>({
    resolver: zodResolver(meetWithUserSchema),
    defaultValues: meetWithUserSchemaDV,
  });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const fetchData = async (id: string) => {
    setIsReady(false);
    const res = await getById({ id: id });
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  const onSubmit: SubmitHandler<meetWithUserSchemaType> = async (
    data: meetApproveSchemaType,
  ) => {
    console.log("data", data);
    await approve(data);

    toast("削除しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<meetWithUserSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: (e) => {
          e.preventDefault();
          setDialogOpen(false);
          console.log(errors);
        },
      },
    });
  };

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="ghost" size="sm">
          <Stamp />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>競技会情報承認</SheetTitle>
            <SheetDescription className="sr-only">
              競技会情報承認画面
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
                    <FormLabel>競技会情報ID</FormLabel>
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会コード</FormLabel>
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
                name="kind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>競技種目</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {meetKind.find((v) => v.id === field.value)?.kind}
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会名</FormLabel>
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
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日</FormLabel>
                    <div
                      hidden={!isReady}
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>設定されていません。</span>
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
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日</FormLabel>
                    <div
                      hidden={!isReady}
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>設定されていません。</span>
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
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>申込締切日</FormLabel>
                    <div
                      hidden={!isReady}
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span>設定されていません。</span>
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
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プール名</FormLabel>
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
                name="poolsize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>水路</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {poolSize.find((v) => v.id === field.value)?.size}
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細説明文</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="whitespace-pre-wrap flex-none min-h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
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
              <FormItem>
                <FormLabel>要項ファイル</FormLabel>
                <FormField
                  control={form.control}
                  name="detail"
                  render={({ field: { value: fvalue } }) => (
                    <FormControl hidden={!isReady}>
                      <div className="block">
                        {(fvalue === null ||
                          JSON.parse(fvalue).length === 0) && (
                          <div className="whitespace-pre-wrap flex-none min-h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                            要項ファイルはありません。
                          </div>
                        )}
                        {fvalue &&
                          JSON.parse(fvalue).map(
                            (v: { value: string; name: string }, i: number) => {
                              return (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  key={`detail_${i}`}
                                  asChild
                                  className="min-w-full justify-between"
                                >
                                  <Link
                                    href={`${v.value}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    {v.name}
                                    <ExternalLink className="size-4" />
                                  </Link>
                                </Button>
                              );
                            },
                          )}
                      </div>
                    </FormControl>
                  )}
                />
                <Skeleton
                  hidden={isReady}
                  className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>添付ファイル</FormLabel>
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field: { value: fvalue } }) => (
                    <FormControl hidden={!isReady}>
                      <div className="block">
                        {(fvalue === null ||
                          JSON.parse(fvalue).length === 0) && (
                          <div className="whitespace-pre-wrap flex-none min-h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                            添付ファイルはありません。
                          </div>
                        )}
                        {fvalue &&
                          JSON.parse(fvalue).map(
                            (v: { value: string; name: string }, i: number) => {
                              return (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  key={`attachment_${i}`}
                                  asChild
                                  className="min-w-full justify-between"
                                >
                                  <Link
                                    href={`${v.value}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    {v.name}
                                    <ExternalLink className="size-4" />
                                  </Link>
                                </Button>
                              );
                            },
                          )}
                      </div>
                    </FormControl>
                  )}
                />
                <Skeleton
                  hidden={isReady}
                  className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
              <SheetFooter className="p-0">
                <Button
                  type="submit"
                  disabled={!isReady || form.formState.isSubmitting}
                  variant="destructive"
                >
                  {form.formState.isSubmitting ? "送信中" : "承認"}
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    キャンセル
                  </Button>
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
