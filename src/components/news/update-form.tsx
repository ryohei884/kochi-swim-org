/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { PencilLine } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  newsWithUserSchemaType,
  newsUpdateSchemaType,
} from "@/lib/news/verification";
import type { PutBlobResult } from "@vercel/blob";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
import { getById, update } from "@/lib/news/actions";
import { newsUpdateSchema, newsUpdateSchemaDV } from "@/lib/news/verification";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  fetchListData: (id: string) => Promise<void>;
}

export default function NewsUpdateForm(props: Props) {
  const { id, fetchListData } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_blob, setBlob] = useState<PutBlobResult | null>(null);
  const [preview, setPreview] = useState("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  const [isReady, setIsReady] = useState<boolean>(false);
  const form = useForm<newsUpdateSchemaType>({
    resolver: zodResolver(newsUpdateSchema),
    defaultValues: newsUpdateSchemaDV,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<newsUpdateSchemaType> = async (
    data: newsUpdateSchemaType
  ) => {
    let newBlob: string | null = null;
    if (data.image !== null && typeof data.image !== "string") {
      newBlob = await uploadImage(data.image);
    }

    const res = await update({ ...data, image: newBlob ?? data.image });

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res.id);
    setPreview("");
    setDialogOpen(false);
    form.reset();
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

  const uploadImage = async (file: File) => {
    if (!file) {
      throw new Error("No file selected");
    }

    const filename = init({ length: 8 });
    const extension = file.name.slice(file.name.lastIndexOf(".") + 1);

    const response = await fetch(
      `/api/news/image/upload?filename=${filename()}.${extension}`,
      {
        method: "POST",
        body: file,
      }
    );

    const newBlob = (await response.json()) as PutBlobResult;
    setBlob(newBlob);
    return newBlob.pathname;
  };

  function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
    const dataTransfer = new DataTransfer();

    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image)
    );

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return { files, displayUrl };
  }

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="ghost" size="sm">
          <PencilLine />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>ニュース編集</SheetTitle>
            <SheetDescription className="sr-only">
              ニュース編集画面
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
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>本文</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Textarea {...field} />
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
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    {" "}
                    <FormItem>
                      <FormLabel>イメージ画像</FormLabel>
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          {...rest}
                          onChange={(event) => {
                            const { files, displayUrl } = getImageData(event);
                            setPreview(displayUrl);
                            onChange(files);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    <div className="aspect-video max-w-[560px]">
                      {preview ? (
                        <Image
                          src={preview}
                          alt=""
                          height={100}
                          width={100}
                          className="w-full h-full object-contain object-center"
                        />
                      ) : (
                        <Image
                          src={
                            value
                              ? `https://nzprheefai1ubld0.public.blob.vercel-storage.com/${value}`
                              : "/next.svg"
                          }
                          alt=""
                          height={100}
                          width={100}
                          className="w-full h-full object-contain object-center"
                        />
                      )}
                    </div>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>掲載開始日</FormLabel>
                    <Popover open={openFromDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={(date) => {
                              field.onChange(date);
                              setOpenFromDate(true);
                            }}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ja })
                            ) : (
                              <span>日付を選択してください。</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenFromDate(false);
                          }}
                          // disabled={(date) => date <= new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Popover open={openToDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={(date) => {
                              field.onChange(date);
                              setOpenToDate(true);
                            }}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ja })
                            ) : (
                              <span>日付を選択してください。</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? field.value : undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenToDate(false);
                          }}
                          // disabled={(date) => date <= new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>リンク先</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="リンク先" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">ニュース</SelectItem>
                          <SelectItem value="1">大会情報</SelectItem>
                          <SelectItem value="2">委員会情報</SelectItem>
                        </SelectContent>
                      </Select>
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
