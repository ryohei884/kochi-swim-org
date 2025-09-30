/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";
import { useState } from "react";
// import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "@/lib/news/actions";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
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

import {
  newsCreateOnSubmitSchema,
  newsCreateOnSubmitSchemaType,
  newsCreateOnSubmitSchemaDV,
  newsWithUserSchemaType,
} from "@/lib/news/verification";

import { PlusIcon } from "lucide-react";

import type { PutBlobResult } from "@vercel/blob";
import { Skeleton } from "../ui/skeleton";
import { init } from "@paralleldrive/cuid2";

interface Props {
  fetchListData: (data: newsWithUserSchemaType) => Promise<void>;
}

export default function NewsCreateForm(props: Props) {
  const { fetchListData } = props;
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [preview, setPreview] = useState("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  const form = useForm<newsCreateOnSubmitSchemaType>({
    // @ts-expect-error React-Hook-Formのエラーだから無視
    resolver: zodResolver(newsCreateOnSubmitSchema),
    defaultValues: newsCreateOnSubmitSchemaDV,
  });

  const onSubmit: SubmitHandler<newsCreateOnSubmitSchemaType> = async (
    data: newsCreateOnSubmitSchemaType,
  ) => {
    let newBlob;
    if (data.image) {
      newBlob = await uploadImage(data.image);
    }
    const res = await create({ ...data, image: newBlob?.url ?? null });

    toast("作成しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res);
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
      `/api/news/image/upload?filename=${filename()}.${extension}`,
      {
        method: "POST",
        body: file,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;
    setBlob(newBlob);

    return newBlob;
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

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <PlusIcon /> ニュース作成
        </Button>
      </SheetTrigger>
      <SheetContent>
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
                  <FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="p-0">
              <Button type="submit">作成</Button>
              <SheetClose asChild>
                <Button variant="outline">キャンセル</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
        {blob && (
          <div>
            Blob url: <a href={blob.url}>{blob.url}</a>
            <Image
              src={blob.url}
              alt="blob image"
              height={100}
              width={100}
              className="w-auto"
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
