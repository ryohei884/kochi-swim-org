"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { exclude, getByIdAdmin } from "@/lib/record/actions";
import type { recordSchemaType } from "@/lib/record/verification";
import { recordSchema, recordSchemaDV } from "@/lib/record/verification";
import {
  intToTime,
  recordCategory,
  recordDistance,
  recordPoolsize,
  recordSex,
  recordStyle,
} from "@/lib/utils";

interface Props {
  id: string;
  fetchListData: () => Promise<void>;
}

export default function RecordExcludeForm(props: Props) {
  const { id, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const form = useForm<recordSchemaType>({
    resolver: zodResolver(recordSchema),
    defaultValues: recordSchemaDV,
  });

  const fetchData = async (id: string) => {
    setIsReady(false);
    const res = await getByIdAdmin(id);
    if (res !== null) {
      form.reset(res);
      setIsReady(true);
    }
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<recordSchemaType> = async (
    data: recordSchemaType,
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
    form.reset();
  };

  const onError: SubmitErrorHandler<recordSchemaType> = (errors) => {
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
          <Trash2 />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>記録削除</SheetTitle>
            <SheetDescription className="sr-only">
              記録削除画面
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
                    <FormLabel>記録ID</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>記録種別</FormLabel>
                    <FormControl hidden={!isReady}>
                      <ButtonGroup>
                        {recordCategory.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                                disabled
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-57.5 border border-input px-3 py-2 file:border-0 max-w-full"
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
                      <ButtonGroup>
                        {recordPoolsize.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                                disabled
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-37.5 border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>性別</FormLabel>
                    <FormControl hidden={!isReady}>
                      <ButtonGroup>
                        {recordSex.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                                disabled
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-45.75 border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>距離</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {
                          recordDistance.find(
                            (value) => value.id === field.value,
                          )?.label
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
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>種目</FormLabel>
                    <FormControl>
                      <div
                        className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                        hidden={!isReady}
                      >
                        {
                          recordStyle.find((value) => value.id === field.value)
                            ?.label
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイム</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {intToTime(field.value)}
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

              {Number(form.getValues("style")) <= 5 ? (
                <FormField
                  control={form.control}
                  name="swimmer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>選手名</FormLabel>
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
                <>
                  <FormField
                    control={form.control}
                    name="swimmer1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第1泳者</FormLabel>
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
                    name="swimmer2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第2泳者</FormLabel>
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
                    name="swimmer3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第3泳者</FormLabel>
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
                    name="swimmer4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第4泳者</FormLabel>
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
                </>
              )}
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>チーム名</FormLabel>
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>樹立日</FormLabel>
                    <div
                      className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm"
                      hidden={!isReady}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ja })
                      ) : (
                        <span></span>
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
                name="meetName"
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
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会会場</FormLabel>
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
                name="valid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>有効記録</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex-none h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                        {field.value ? "現記録" : "元記録"}
                      </div>
                    </FormControl>
                    <div hidden={isReady} className="flex">
                      <Skeleton className="flex h-4 w-8 rounded-2xl border border-input px-3 py-2 file:border-0 max-w-full" />
                      <Skeleton className="ml-2 flex h-3.5 w-10.5 border border-input px-3 py-2 file:border-0 max-w-full" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>イメージ画像</FormLabel>
                    <div className="flex-none  w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      {field.value ? (
                        <Image
                          src={`${field.value}`}
                          alt=""
                          height={100}
                          width={100}
                          className="w-full h-full object-contain object-center"
                        />
                      ) : (
                        "画像なし"
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="p-0">
                <Button type="submit" disabled={!isReady}>
                  削除
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
