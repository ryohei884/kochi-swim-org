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
  fromDate: z.date(),
  toDate: z.date(),
  link: z.url().optional(),
  editorId: z.number().int().nonnegative(),
  approverId: z.number().int().nonnegative(),
  approved: z.boolean(),
  approvedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export default function NewsCreateForm() {
  // 1. Define your form.
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
      editorId: 0,
      approverId: 0,
      approved: false,
      approvedAt: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
