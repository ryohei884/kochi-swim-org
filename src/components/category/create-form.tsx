"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  categoryWithUserSchemaType,
  categoryCreateSchemaType,
} from "@/lib/category/verification";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";

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
import { create } from "@/lib/category/actions";
import { categoryDisplay } from "@/lib/category/role";
import {
  categoryCreateSchema,
  categoryCreateSchemaDV,
} from "@/lib/category/verification";

interface Props {
  fetchListData: (data: categoryWithUserSchemaType) => Promise<void>;
  maxOrder: number;
}

export default function CategoryCreateForm(props: Props) {
  const { fetchListData, maxOrder } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm<categoryCreateSchemaType>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: categoryCreateSchemaDV,
  });

  useEffect(() => {
    form.setValue("order", maxOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxOrder]);

  const onSubmit: SubmitHandler<categoryCreateSchemaType> = async (
    data: categoryCreateSchemaType,
  ) => {
    const res = await create(data);

    toast("作成しました。", {
      // description: <div>{JSON.stringify(data, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res);
    setDialogOpen(false);
    form.reset();
  };

  const onError: SubmitErrorHandler<categoryCreateSchemaType> = (errors) => {
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
        <Button variant="outline" size="sm">
          <PlusIcon /> カテゴリー作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
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
                    <FormLabel>カテゴリー名</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="カテゴリー名"
                        {...field}
                      />
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
                      <Input
                        type="text"
                        placeholder="リンク文字列"
                        {...field}
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
                      <Input type="number" placeholder="表示順" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>表示設定</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="表示設定" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryDisplay.map((value, index) => (
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
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
