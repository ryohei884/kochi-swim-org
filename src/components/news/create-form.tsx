"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { Switch } from "@/components/ui/switch";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  newsId: z.number().int().nonnegative(),
  posterId: z.number().int().nonnegative(),
  title: z
    .string()
    .min(2, {
      message: "題名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "題名は128文字以下で入力してください。",
    }),

  detail: z
    .string()
    .min(2, {
      message: "本文は2文字以上で入力してください。",
    })
    .max(32768, {
      message: "本文は32768文字以下で入力してください。",
    }),
  image: z
    .file()
    .min(10_000)
    .max(1_000_000)
    .mime(["image/png", "image/jpeg"])
    .optional(),
  fromDate: z.date().nonoptional({
    error: "掲載開始日は必須項目です。",
  }),
  toDate: z.date().optional(),
  link: z.url().optional(),
  editorId: z.number().int().nonnegative().array(),
  approverId: z.number().int().nonnegative(),
  approved: z.boolean(),
  approvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export default function NewsCreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newsId: 0,
      posterId: 1,
      title: "",
      detail: "",
      image: undefined,
      fromDate: new Date(),
      toDate: new Date(),
      link: undefined,
      editorId: [0],
      approverId: 0,
      approved: false,
      approvedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ニュースID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="ニュースID" {...field} />
              </FormControl>
              <FormDescription>記事を特定する連番です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿者ID</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="投稿者ID" {...field} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">林 良平</SelectItem>
                    <SelectItem value="1">堤 知之</SelectItem>
                    <SelectItem value="2">三浦 光夫</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>投稿者のIDです。</FormDescription>
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
              <FormControl>
                <Input type="text" placeholder="題名" {...field} />
              </FormControl>
              <FormDescription>
                ニュース一覧に表示される題名です。
              </FormDescription>
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
              <FormDescription>ニュース本文です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field }) => (
            <FormItem>
              <FormLabel>イメージ画像</FormLabel>
              <FormControl>
                <Input id="picture" type="file" />
              </FormControl>
              <FormDescription>イメージ画像です。</FormDescription>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
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
                    onSelect={field.onChange}
                    // disabled={(date) => date <= new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>掲載開始日以降に掲載されます。</FormDescription>
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
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
                    onSelect={field.onChange}
                    // disabled={(date) => date <= new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                掲載終了日以降に掲載が取り下げられます。
              </FormDescription>
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
                <Select>
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
              <FormDescription>リンク先です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="editorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿者ID</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="編集者ID" {...field} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">林 良平</SelectItem>
                    <SelectItem value="1">堤 知之</SelectItem>
                    <SelectItem value="2">三浦 光夫</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>編集者のIDです。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="approverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>承認者ID</FormLabel>
              <FormControl>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="承認者ID" {...field} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">林 良平</SelectItem>
                    <SelectItem value="1">堤 知之</SelectItem>
                    <SelectItem value="2">三浦 光夫</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>承認者のIDです。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="approved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>承認状態</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="approvedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>承認日</FormLabel>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                disabled
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>承認されていません。</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <FormDescription>承認日です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>投稿日</FormLabel>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                disabled
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>投稿されていません。</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <FormDescription>投稿日です。</FormDescription>
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
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                disabled
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>投稿されていません。</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <FormDescription>最終更新日です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">投稿</Button>
      </form>
    </Form>
  );
}
