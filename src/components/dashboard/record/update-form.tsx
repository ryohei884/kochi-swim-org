"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { PencilLine } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { recordUpdateSchemaType } from "@/lib/record/verification";
import type { PutBlobResult } from "@vercel/blob";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";

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
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { getByIdAdmin, update } from "@/lib/record/actions";
import {
  recordUpdateSchemaDV,
  recordUpdateSchema,
} from "@/lib/record/verification";
import {
  cn,
  intToTime,
  timeToInt,
  recordCategory,
  recordPoolsize,
  recordSex,
  recordDistance,
  recordStyle,
} from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface Props {
  id: string;
  fetchListData: (id: string) => Promise<void>;
}

export default function RecordUpdateForm(props: Props) {
  const { id, fetchListData } = props;
  const [preview, setPreview] = useState("");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openDate, setOpenDate] = useState(false);

  const [isReady, setIsReady] = useState<boolean>(false);
  const form = useForm<recordUpdateSchemaType>({
    resolver: zodResolver(recordUpdateSchema),
    defaultValues: {
      ...recordUpdateSchemaDV,
      time: Number(
        intToTime(recordUpdateSchemaDV.time).replace(".", "").replace(":", ""),
      ),
    },
  });

  const fetchData = async (id: string) => {
    setIsReady(false);
    const res = await getByIdAdmin(id);
    if (res !== null) {
      form.reset({
        ...res,
        time: Number(intToTime(res.time).replace(".", "").replace(":", "")),
      });
      setIsReady(true);
    }
  };

  useEffect(() => {
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const onSubmit: SubmitHandler<recordUpdateSchemaType> = async (
    data: recordUpdateSchemaType,
  ) => {
    let newBlob: string | null = null;
    if (data.image !== null && typeof data.image !== "string") {
      newBlob = await uploadImage(data.image);
    }

    const res = await update({
      ...data,
      swimmer1: data.swimmer1.replace("　", " ").trim(),
      swimmer2: data.swimmer2 ? data.swimmer2.replace("　", " ").trim() : null,
      swimmer3: data.swimmer3 ? data.swimmer3.replace("　", " ").trim() : null,
      swimmer4: data.swimmer4 ? data.swimmer4.replace("　", " ").trim() : null,
      category: Number(data.category),
      poolsize: Number(data.poolsize),
      sex: Number(data.sex),
      style: Number(data.style),
      distance: Number(data.distance),
      time: timeToInt(Number(data.time)),
      image: newBlob ?? null,
      team: data.team.replace("　", " ").trim(),
      place: data.place.replace("　", " ").trim(),
      meetName: data.meetName.replace("　", " ").trim(),
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

  const onError: SubmitErrorHandler<recordUpdateSchemaType> = (errors) => {
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
      `/api/record/image/upload?filename=images/${filename()}.${extension}`,
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
  const minDT = new Date(dt.setFullYear(dt.getFullYear() - 22));
  const maxDT = new Date(dt.setFullYear(dt.getFullYear() + 24));

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
            <SheetTitle>記録編集</SheetTitle>
            <SheetDescription className="sr-only">
              記録編集画面
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
                    <FormLabel>記録ID</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>記録種別</FormLabel>
                    <FormControl hidden={!isReady}>
                      <ButtonGroup>
                        {recordCategory.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("category", value.id);
                                }}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-57.5 border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poolsize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>水路</FormLabel>
                    <FormControl hidden={!isReady}>
                      <ButtonGroup>
                        {recordPoolsize.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("poolsize", value.id);
                                }}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-37.5 border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>性別</FormLabel>
                    <FormControl hidden={!isReady}>
                      <ButtonGroup>
                        {recordSex.map(
                          (value, index) =>
                            index > 0 && (
                              <Button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("sex", value.id);
                                }}
                                variant={
                                  field.value === value.id
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {value.label}
                              </Button>
                            ),
                        )}
                      </ButtonGroup>
                    </FormControl>
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-45.75 border border-input px-3 py-2 file:border-0 max-w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>距離</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
                          <SelectValue placeholder="距離" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {recordDistance.map((value, index) => (
                            <SelectItem key={index} value={String(value.id)}>
                              {value.label}
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
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>種目</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
                          <SelectValue placeholder="種目" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {recordStyle.map((value, index) => (
                            <SelectItem key={index} value={String(value.id)}>
                              {value.label}
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
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイム</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="grid justify-center-safe align-text-bottom">
                        <InputOTP
                          maxLength={6}
                          inputMode="numeric"
                          pattern={REGEXP_ONLY_DIGITS}
                          onChange={(value) => {
                            return form.setValue("time", Number(value));
                          }}
                          value={String(field.value).padStart(6, "0")}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <div className="text-sm">分</div>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <div className="text-sm">秒</div>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <div
                      hidden={isReady}
                      className="flex justify-center-safe items-center"
                    >
                      <Skeleton className="flex h-9 w-18 border border-input px-3 py-2 file:border-0 max-w-full" />
                      <div className="text-sm mx-2">分</div>
                      <Skeleton className="flex h-9 w-18 border border-input px-3 py-2 file:border-0 max-w-full" />
                      <div className="text-sm mx-2">秒</div>
                      <Skeleton className="flex h-9 w-18 border border-input px-3 py-2 file:border-0 max-w-full" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {Number(form.getValues("style")) <= 5 ? (
                <FormField
                  control={form.control}
                  name="swimmer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>選手名</FormLabel>
                      <FormControl hidden={!isReady}>
                        <Input type="text" placeholder="選手名" {...field} />
                      </FormControl>
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="swimmer1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第1泳者</FormLabel>
                        <FormControl hidden={!isReady}>
                          <Input type="text" placeholder="第1泳者" {...field} />
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
                    name="swimmer2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第2泳者</FormLabel>
                        <FormControl hidden={!isReady}>
                          <Input
                            type="text"
                            placeholder="第2泳者"
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
                    name="swimmer3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第3泳者</FormLabel>
                        <FormControl hidden={!isReady}>
                          <Input
                            type="text"
                            placeholder="第3泳者"
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
                    name="swimmer4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>第4泳者</FormLabel>
                        <FormControl hidden={!isReady}>
                          <Input
                            type="text"
                            placeholder="第4泳者"
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
                </>
              )}
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>チーム名</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Input type="text" placeholder="チーム名" {...field} />
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>樹立日</FormLabel>
                    <Popover open={openDate}>
                      <PopoverTrigger asChild hidden={!isReady}>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            onClick={(date) => {
                              field.onChange(date);
                              setOpenDate(true);
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
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenDate(false);
                          }}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
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
                name="meetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会名</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Input type="text" placeholder="大会名" {...field} />
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
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会会場</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Input type="text" placeholder="大会会場" {...field} />
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
                name="valid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>有効記録</FormLabel>
                    <FormControl hidden={!isReady}>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="valid"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="valid">
                          {field.value ? "現記録" : "元記録"}
                        </Label>
                      </div>
                    </FormControl>
                    <div hidden={isReady} className="flex">
                      <Skeleton className="flex h-4 w-8 rounded-2xl border border-input px-3 py-2 file:border-0 max-w-full" />
                      <Skeleton className="ml-2 flex h-3.5 w-10.5 border border-input px-3 py-2 file:border-0 max-w-full" />
                    </div>
                    <FormMessage />
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
                      <FormControl hidden={!isReady}>
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
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />

                      <FormMessage />
                    </FormItem>
                    <div
                      hidden={!isReady}
                      className="aspect-video max-w-[560px]"
                    >
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
                    <Skeleton
                      hidden={isReady}
                      className="flex aspect-video max-w-[560px]  border border-input px-3 py-2 file:border-0"
                    />
                  </>
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
