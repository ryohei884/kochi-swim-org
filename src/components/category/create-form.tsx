"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
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
import { toast } from "sonner";
import { createCategory } from "@/lib/actions";
import { categoryPermission } from "@/lib/permissions";

import { redirect, RedirectType } from "next/navigation";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "カテゴリー名は1文字以上で入力してください。",
    })
    .max(128, {
      message: "カテゴリー名は128文字以下で入力してください。",
    }),
  link: z
    .string()
    .min(1, {
      message: "URLは1文字以上で入力してください。",
    })
    .max(16, {
      message: "URLは16文字以下で入力してください。",
    })
    .regex(/^\w*$/, { message: "半角英数字のみ使えます。" }),
  order: z.transform(Number).pipe(z.number().positive()),
  permission: z.transform(Number).pipe(z.number().positive()),
});

export type formSchemaType = z.infer<typeof formSchema>;

export default function CategoryCreateForm() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      link: "",
      order: 1,
      permission: 0,
    },
  });

  const onSubmit: SubmitHandler<formSchemaType> = async (
    data: formSchemaType,
  ) => {
    console.log(data);

    await createCategory(data);

    toast("You submitted the following values", {
      description: <div>{JSON.stringify(data, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    redirect("./list", RedirectType.push);
  };

  const onError: SubmitErrorHandler<formSchemaType> = (errors) => {
    toast("ERROR!!!", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ名</FormLabel>
              <FormControl>
                <Input type="text" placeholder="カテゴリ名" {...field} />
              </FormControl>
              <FormDescription>カテゴリ名です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>リンク文字列</FormLabel>
              <FormControl>
                <Input type="text" placeholder="リンク文字列" {...field} />
              </FormControl>
              <FormDescription>
                リンクURLに用いられる文字列です。
              </FormDescription>
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
                <Input type="number" placeholder="表示順" {...field} />
              </FormControl>
              <FormDescription>カテゴリを表示する順番です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>表示設定</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="表示設定" {...field} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryPermission.map((value, index) => (
                      <SelectItem key={index} value={String(value.range)}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>表示対象者の設定です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">作成</Button>
      </form>
    </Form>
  );
}
