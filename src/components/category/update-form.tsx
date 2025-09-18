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
import { toast } from "sonner";
import { getCategoryById, updateCategory } from "@/lib/actions";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { categoryPermission } from "@/lib/permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { redirect, RedirectType } from "next/navigation";

export const formSchema = z.object({
  categoryId: z.string().nonoptional(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type formSchemaType = z.infer<typeof formSchema>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const omitCategoryUpdateFormSchema = formSchema.omit({
  createdAt: true,
  updatedAt: true,
});
export type omitCategoryUpdateFormSchemaType = z.infer<
  typeof omitCategoryUpdateFormSchema
>;

const defaultValues: formSchemaType = {
  categoryId: "",
  name: "",
  link: "",
  order: 0,
  permission: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

interface Props {
  id: string;
}

export default function CategoryUpdateForm(props: Props) {
  const { id } = props;
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const fetchData = async (id: string) => {
    const res = await getCategoryById(id);
    if (res !== null) {
      form.reset(res);
      console.log(res);
    }
  };

  useEffect(() => {
    fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<formSchemaType> = async (
    data: omitCategoryUpdateFormSchemaType,
  ) => {
    console.log(data);

    await updateCategory(data);

    toast("You submitted the following values", {
      description: <div>{JSON.stringify(data, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    redirect("../list", RedirectType.push);
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリID</FormLabel>
              <FormControl hidden={!form.formState.isReady}>
                <Input type="text" {...field} disabled />
              </FormControl>
              <Skeleton
                hidden={form.formState.isReady}
                className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
              />
              <FormDescription>カテゴリを特定する連番です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ名</FormLabel>
              <FormControl hidden={!form.formState.isReady}>
                <Input type="text" {...field} />
              </FormControl>
              <Skeleton
                hidden={form.formState.isReady}
                className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
              />
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
              <FormControl hidden={!form.formState.isReady}>
                <Input type="text" {...field} />
              </FormControl>
              <Skeleton
                hidden={form.formState.isReady}
                className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
              />
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
              <FormControl hidden={!form.formState.isReady}>
                <Input type="number" {...field} />
              </FormControl>
              <Skeleton
                hidden={form.formState.isReady}
                className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
              />
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
              <div hidden={!form.formState.isReady}>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={String(field.value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
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
              </div>
              <Skeleton
                className="flex h-9 items-center justify-end border border-input px-3 py-2 [&amp;&gt;span]:line-clamp-1 w-full"
                hidden={form.formState.isReady}
              >
                <ChevronDownIcon className="size-4 opacity-50" />
              </Skeleton>
              <FormDescription>表示対象者の設定です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>作成日</FormLabel>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
                disabled
                hidden={!form.formState.isReady}
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>作成されていません。</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <Skeleton
                hidden={form.formState.isReady}
                className="w-[240px] pl-3 text-left font-normal flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
              >
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Skeleton>
              <FormDescription>作成日です。</FormDescription>
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
                hidden={!form.formState.isReady}
              >
                {field.value ? (
                  format(field.value, "PPP", { locale: ja })
                ) : (
                  <span>作成されていません。</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
              <Skeleton
                hidden={form.formState.isReady}
                className="w-[240px] pl-3 text-left font-normal flex h-9 border border-input px-3 py-2 file:border-0 max-w-full"
              >
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Skeleton>
              <FormDescription>最終更新日です。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">更新</Button>
      </form>
    </Form>
  );
}
