"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Switch } from "@/components/ui/switch";
import { create } from "@/lib/live/actions";
import type { liveCreateSchemaType } from "@/lib/live/verification";
import { liveCreateSchema, liveCreateSchemaDV } from "@/lib/live/verification";
import { cn } from "@/lib/utils";

interface Props {
  fetchListData: (id: string) => Promise<void>;
  maxOrder: number;
}

export default function LiveCreateForm(props: Props) {
  const { fetchListData, maxOrder } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);

  const form = useForm<liveCreateSchemaType>({
    resolver: zodResolver(liveCreateSchema),
    defaultValues: liveCreateSchemaDV,
  });

  useEffect(() => {
    form.setValue("order", maxOrder);
    setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxOrder]);

  const onSubmit: SubmitHandler<liveCreateSchemaType> = async (
    data: liveCreateSchemaType,
  ) => {
    const res = await create(data);

    toast("作成しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res.id);
    setDialogOpen(false);
    form.reset();
  };

  const onError: SubmitErrorHandler<liveCreateSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  //   const dt = new Date();
  //   const minDT = new Date(dt.setFullYear(dt.getFullYear() - 2));
  //   const maxDT = new Date(dt.setFullYear(dt.getFullYear() + 4));

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <Plus /> ライブ配信作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>ライブ配信作成</SheetTitle>
            <SheetDescription className="sr-only">
              ライブ配信作成画面
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
                          //   startMonth={minDT}
                          //   endMonth={maxDT}
                          //   disabled={(date) => date >= maxDT || date <= minDT}
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
                name="meetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>関連大会ID</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="onAir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配信状態</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 mt-4">
                        <Switch
                          id="onAir"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="onAir">
                          {field.value ? "配信中" : "準備中"}
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配信URL</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} value={field.value || ""} />
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
              <FormField
                control={form.control}
                name="finished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会終了</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2 mt-4">
                        <Switch
                          id="finished"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="finished">
                          {field.value ? "大会終了後" : "大会終了前"}
                        </Label>
                      </div>
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
