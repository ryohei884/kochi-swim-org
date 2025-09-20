"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "sonner";
import { createCategory } from "@/lib/actions";
import { categoryPermission } from "@/lib/permissions";
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
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const extendCategoryUpdateFormSchema = formSchema.extend({
  categoryId: z.string().nonoptional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdUserId: z.string(),
});
export type extendCategoryUpdateFormSchemaType = z.infer<
  typeof extendCategoryUpdateFormSchema
>;

interface Props {
  fetchListData: (data: extendCategoryUpdateFormSchemaType) => Promise<void>;
}

export default function CategoryCreateForm(props: Props) {
  const { fetchListData } = props;

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
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
    const res = await createCategory(data);

    toast("You submitted the following values", {
      description: <div>{JSON.stringify(data, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res);
    setDialogOpen(false);
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
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <PlusIcon /> カテゴリー作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>カテゴリー作成</SheetTitle>
          <SheetDescription className="sr-only">
            カテゴリー作成画面
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-8 p-4"
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
      </SheetContent>
    </Sheet>
  );
}
