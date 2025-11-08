"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Stamp } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  newsApproveSchemaType,
  newsWithUserSchemaType,
} from "@/lib/news/verification";
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
import { getByIdAdmin, approve } from "@/lib/news/actions";
import {
  newsWithUserSchema,
  newsWithUserSchemaDV,
} from "@/lib/news/verification";
import { newsLinkCategory } from "@/lib/utils";
import { getApproverList } from "@/lib/permission/actions";
import { auth } from "@/auth";
import type { DefaultSession } from "@auth/core/types";

interface Session {
  user: {
    role: "administrator" | "user";
  } & DefaultSession["user"];
}

interface Props {
  id: string;
  fetchListData: () => Promise<void>;
}

type Approver = {
  userId: string;
  userDisplayName: string | null;
  userName: string | null;
}[];

export default function NewsApproveForm(props: Props) {
  const { id, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [approver, setApprover] = useState<Approver>([]);

  const form = useForm<newsWithUserSchemaType>({
    resolver: zodResolver(newsWithUserSchema),
    defaultValues: newsWithUserSchemaDV,
  });

  const fetchData = async (id: string) => {
    setIsReady(false);
    const resAvr = await getApproverList({ categoryLink: "news" });
    if (resAvr !== null) {
      setApprover(resAvr);
    } else {
      setApprover([]);
    }

    const res = await getByIdAdmin({ id: id });
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<newsWithUserSchemaType> = async (
    data: newsApproveSchemaType,
  ) => {
    await approve(data);

    toast("承認しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData();
    setDialogOpen(false);
  };

  const onError: SubmitErrorHandler<newsWithUserSchemaType> = (errors) => {
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
          <Stamp />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>ニュース承認</SheetTitle>
            <SheetDescription className="sr-only">
              ニュース承認画面
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
                    <FormLabel>ニュースID</FormLabel>
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>題名</FormLabel>
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
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>本文</FormLabel>
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
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value } }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>イメージ画像</FormLabel>
                    <div className="flex-none  w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      <Image
                        src={value ? `${value}` : "/logo.png"}
                        alt=""
                        height={80}
                        width={80}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>掲載開始日</FormLabel>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>掲載終了日</FormLabel>
                    <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>リンク先</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {
                          newsLinkCategory.find((v) => v.id === field.value)
                            ?.name
                        }
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
                name="linkString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>リンク先ID</FormLabel>
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
