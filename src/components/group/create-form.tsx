"use client";

import { useState } from "react";
import { useForm, SubmitHandler, SubmitErrorHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "@/lib/group/actions";
import {
  groupWithUserSchemaType,
  groupCreateSchemaType,
  groupCreateSchema,
  groupCreateSchemaDV,
} from "@/lib/group/verification";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface Props {
  fetchListData: (data: groupWithUserSchemaType) => Promise<void>;
}

export default function GroupCreateForm(props: Props) {
  const { fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm<groupCreateSchemaType>({
    resolver: zodResolver(groupCreateSchema),
    defaultValues: groupCreateSchemaDV,
  });

  const onSubmit: SubmitHandler<groupCreateSchemaType> = async (
    data: groupCreateSchemaType,
  ) => {
    const res = await create(data);

    toast("作成しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res);
    setDialogOpen(false);
    form.reset();
  };

  const onError: SubmitErrorHandler<groupCreateSchemaType> = (errors) => {
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
          <PlusIcon /> グループ作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>グループ作成</SheetTitle>
          <SheetDescription className="sr-only">
            グループ作成画面
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
                  <FormLabel>グループ名</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="グループ名" {...field} />
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
