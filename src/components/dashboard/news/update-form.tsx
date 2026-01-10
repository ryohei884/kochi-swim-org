// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import type { PutBlobResult } from "@vercel/blob";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon, ExternalLink, PencilLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getByIdAdmin, update } from "@/lib/news/actions";
import type { newsUpdateOnSubmitSchemaType } from "@/lib/news/verification";
import {
  newsUpdateOnSubmitSchema,
  newsUpdateOnSubmitSchemaDV,
} from "@/lib/news/verification";
import { cn, newsLinkCategory } from "@/lib/utils";

type Approver = {
  userId: string;
  userDisplayName: string | null;
  userName: string | null;
}[];

interface Props {
  id: string;
  fetchListData: (id: string) => Promise<void>;
  approver: Approver;
}

export default function NewsUpdateForm(props: Props) {
  const { id, fetchListData, approver } = props;
  const [preview, setPreview] = useState("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);

  const [isReady, setIsReady] = useState<boolean>(false);

  const form = useForm<newsUpdateOnSubmitSchemaType>({
    resolver: zodResolver(newsUpdateOnSubmitSchema),
    defaultValues: newsUpdateOnSubmitSchemaDV,
  });

  const fetchData = async (id: string) => {
    setIsReady(false);

    const res = await getByIdAdmin({ id: id });
    if (res !== null) {
      form.reset({ ...res, linkCategory: String(res.linkCategory) });
      setIsReady(true);
    }

    setIsReady(true);
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<newsUpdateOnSubmitSchemaType> = async (
    data: newsUpdateOnSubmitSchemaType,
  ) => {
    let newBlob: string | null = null;
    if (data.image !== null && typeof data.image !== "string") {
      newBlob = await uploadImage(data.image);
    }

    const res = await update({
      ...data,
      linkCategory: Number(data.linkCategory),
      image: newBlob ?? data.image,
    });

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

  const onError: SubmitErrorHandler<newsUpdateOnSubmitSchemaType> = (
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

  const AnchorTag = ({ node, children, ...props }: any) => {
    try {
      new URL(props.href ?? "");
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    } catch (e) {}
    return (
      <Link {...props} className="flex items-center underline">
        {children}
        <ExternalLink className="h-4 ml-1" />
      </Link>
    );
  };

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
            <SheetTitle>お知らせ編集</SheetTitle>
            <SheetDescription className="sr-only">
              お知らせ編集画面
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
                    <FormLabel>お知らせID</FormLabel>
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
                    <FormLabel className="pt-8 pb-1">
                      リンク表示（例）
                    </FormLabel>
                    <code className=" outline rounded-xs p-1 text-xs">
                      [表示名](https://www.swim-kochi.org)
                    </code>
                    <FormLabel className="pt-8 pb-1">プレビュー</FormLabel>
                    <div className="whitespace-pre-wrap flex-none min-h-9 w-full border border-input px-3 py-2 max-w-full rounded-md bg-accent text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: AnchorTag,
                        }}
                      >
                        {field.value}
                      </ReactMarkdown>
                    </div>
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
                          src={value ? `${value}` : "/logo.png"}
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
                        <FormControl hidden={!isReady}>
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
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
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
                        <FormControl hidden={!isReady}>
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
                          selected={field.value ? field.value : undefined}
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
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
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
                    <FormControl hidden={!isReady}>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
                          <SelectValue placeholder="リンク先" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {newsLinkCategory.map((v) => (
                            <SelectItem key={v.id} value={String(v.id)}>
                              {v.name}
                            </SelectItem>
                          ))}
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
              <FormField
                control={form.control}
                name="linkString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>リンク先ID</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Input
                        type="text"
                        placeholder="リンク先ID"
                        {...field}
                        value={field.value || ""}
                      />
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
                      <Input type="number" {...field} />
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
                name="approvedUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>承認者</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
                          <SelectValue placeholder="承認者" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {approver.map((v) => (
                            <SelectItem key={v.userId} value={v.userId}>
                              {v.userDisplayName
                                ? v.userDisplayName
                                : v.userName}
                            </SelectItem>
                          ))}
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
