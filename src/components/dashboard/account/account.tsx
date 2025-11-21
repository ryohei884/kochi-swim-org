"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser, update } from "@/lib/account/actions";
import type { userSchemaType } from "@/lib/account/verification";
import { userSchema, userSchemaDV } from "@/lib/account/verification";

export default function Account() {
  const [isReady, setIsReady] = useState<boolean>(false);

  const form = useForm<userSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: userSchemaDV,
  });

  const fetchData = async () => {
    setIsReady(false);
    const res = await getUser();
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  useEffect(() => {
    fetchData();
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<userSchemaType> = async (
    data: userSchemaType,
  ) => {
    console.log(data);
    const res = await update(data);

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchData();
    form.reset(res);
  };

  const onError: SubmitErrorHandler<userSchemaType> = async (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: (e) => {
          e.preventDefault();
          console.log(errors);
        },
      },
    });
  };

  return (
    <>
      {" "}
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight p-2 flex justify-between">
        アカウント設定
      </h4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8 p-4"
        >
          <div className="w-xs flex justify-center">
            {form.getValues("image") && (
              <Image
                src={`${form.getValues("image")}`}
                alt="image"
                height={120}
                width={120}
                hidden={!isReady}
              />
            )}
            <Skeleton
              hidden={isReady}
              className="flex h-30 w-30 border border-input px-3 py-2 file:border-0 max-w-full"
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl hidden={!isReady}>
                  <div className="w-xs flex-none h-9 border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                    {field.value}
                  </div>
                </FormControl>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>表示名</FormLabel>
                <FormControl hidden={!isReady}>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    className="w-xs"
                  />
                </FormControl>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormDescription className="w-xs">
                  作成者、変更者、承認者として管理画面に表示されたり、LINE通知時の宛名表記に使用されます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl hidden={!isReady}>
                  <div className="w-xs flex-none h-9 border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                    {field.value}
                  </div>
                </FormControl>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>役割</FormLabel>
                <FormControl hidden={!isReady}>
                  <div className="w-xs flex-none h-9 border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                    {field.value}
                  </div>
                </FormControl>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>開始日</FormLabel>
                <div
                  hidden={!isReady}
                  className="w-xs flex-none h-9  border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: ja })
                  ) : (
                    <span>設定されていません。</span>
                  )}
                </div>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
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
                <FormLabel>更新日</FormLabel>
                <div
                  hidden={!isReady}
                  className="w-xs flex-none h-9  border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                >
                  {field.value ? (
                    format(field.value, "PPP", { locale: ja })
                  ) : (
                    <span>設定されていません。</span>
                  )}
                </div>
                <Skeleton
                  hidden={isReady}
                  className="w-xs flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="w-xs" />
          <div className="flex justify-between w-xs  items-stretch gap-2">
            <Button variant="outline" className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" disabled={!isReady} className="flex-1">
              変更
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
