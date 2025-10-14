/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon } from "lucide-react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { newsCreateOnSubmitSchemaType } from "@/lib/news/verification";
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
import { create } from "@/lib/news/actions";
import {
  newsCreateOnSubmitSchema,
  newsCreateOnSubmitSchemaDV,
} from "@/lib/news/verification";
import { cn, newsLinkCategory } from "@/lib/utils";

interface Props {
  fetchListData: (id: string) => Promise<void>;
  maxOrder: number;
}

export default function NewsCreateForm(props: Props) {
  const { fetchListData, maxOrder } = props;

  const [preview, setPreview] = useState("");
  const [isReady, setIsReady] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  const form = useForm<newsCreateOnSubmitSchemaType>({
    // @ts-expect-error React-Hook-Formのエラーだから無視
    resolver: zodResolver(newsCreateOnSubmitSchema),
    defaultValues: newsCreateOnSubmitSchemaDV,
  });

  useEffect(() => {
    form.setValue("order", maxOrder);
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxOrder]);

  const onSubmit: SubmitHandler<newsCreateOnSubmitSchemaType> = async (
    data: newsCreateOnSubmitSchemaType,
  ) => {
    let newBlob;
    if (data.image !== null && typeof data.image !== "string") {
      newBlob = await uploadImage(data.image);
    }
    const res = await create({
      ...data,
      linkCategory: Number(data.linkCategory),
      image: newBlob ?? null,
    });

    toast("作成しました。", {
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

  const onError: SubmitErrorHandler<newsCreateOnSubmitSchemaType> = (
    errors,
  ) => {
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
      `/api/news/image/upload?filename=images/${filename()}.${extension}`,
      {
        method: "POST",
        body: file,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;
    return newBlob.url;
  };

  function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
    const dataTransfer = new DataTransfer();

    Array.from(event.target.files!).forEach((image) =>
      dataTransfer.items.add(image),
    );

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);

    return { files, displayUrl };
  }

  const dt = new Date();
  const minDT = new Date(dt.setFullYear(dt.getFullYear() - 2));
  const maxDT = new Date(dt.setFullYear(dt.getFullYear() + 4));

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <Plus /> ニュース作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>ニュース作成</SheetTitle>
            <SheetDescription className="sr-only">
              ニュース作成画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>題名</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="題名" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { onChange, value, ...rest } }) => (
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
                )}
              />
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
                  <Skeleton className="w-full h-full bg-accent rounded-lg border flex justify-center items-center" />
                )}
              </div>
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
                              !field.value && "text-muted-foreground",
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
                          startMonth={minDT}
                          endMonth={maxDT}
                          disabled={(date) => date >= maxDT || date <= minDT}
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
                              !field.value && "text-muted-foreground",
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
                          selected={field.value ? field.value : null}
                          startMonth={minDT}
                          endMonth={maxDT}
                          disabled={(date) => date >= maxDT || date <= minDT}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenToDate(false);
                          }}
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
                name="linkCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>リンク先</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="リンク先" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {newsLinkCategory.map((value, index) => (
                            <SelectItem key={index} value={String(value.id)}>
                              {value.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
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
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="リンク先ID"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="p-0">
                <Button type="submit" disabled={!isReady}>
                  作成
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
