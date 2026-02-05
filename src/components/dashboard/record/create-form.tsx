"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import type { PutBlobResult } from "@vercel/blob";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CalendarIcon, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { create } from "@/lib/record/actions";
import type { recordCreateSchemaType } from "@/lib/record/verification";
import {
  recordCreateSchema,
  recordCreateSchemaDV,
} from "@/lib/record/verification";
import {
  cn,
  recordCategory,
  recordDistance,
  recordPoolsize,
  recordSex,
  recordStyle,
  timeToInt,
} from "@/lib/utils";

interface Props {
  fetchListData: (id: string) => Promise<void>;
}

export default function RecordCreateForm(props: Props) {
  const { fetchListData } = props;

  const [preview, setPreview] = useState("");
  const [isReady, setIsReady] = useState<boolean>(true);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openDate, setOpenDate] = useState(false);
  const [styles, setStyles] = useState(recordStyle);

  const form = useForm<recordCreateSchemaType>({
    resolver: zodResolver(recordCreateSchema),
    defaultValues: recordCreateSchemaDV,
  });

  const { watch, register, ...others } = form;

  const onSubmit: SubmitHandler<recordCreateSchemaType> = async (
    data: recordCreateSchemaType,
  ) => {
    setIsReady(false);
    let newBlob;
    if (data.image !== null && typeof data.image !== "string") {
      newBlob = await uploadImage(data.image);
    }

    const res = await create({
      ...data,
      swimmer1: data.swimmer1.replace("　", " ").trim(),
      swimmer2:
        data.swimmer2 !== null ? data.swimmer2.replace("　", " ").trim() : null,
      swimmer3:
        data.swimmer3 !== null ? data.swimmer3.replace("　", " ").trim() : null,
      swimmer4:
        data.swimmer4 !== null ? data.swimmer4.replace("　", " ").trim() : null,
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

    toast("作成しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res.id);
    setPreview("");
    setDialogOpen(false);
    form.reset();
    setIsReady(true);
  };

  const onError: SubmitErrorHandler<recordCreateSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
    setIsReady(true);
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
  const minDT = new Date(dt.setFullYear(dt.getFullYear() - 102));
  const maxDT = new Date(dt.setFullYear(dt.getFullYear() + 104));

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchDistance = watch("distance");

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <Plus /> 記録作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>記録作成</SheetTitle>
            <SheetDescription className="sr-only">
              記録作成画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>記録種別</FormLabel>
                    <FormControl>
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
                    <FormControl>
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
                    <FormControl>
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
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="距離" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {recordDistance.map((value, index) => (
                            <SelectItem
                              key={`distance_${index}`}
                              value={String(value.id)}
                            >
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
              {watchDistance <= 6 && (
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>種目</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="種目" {...field} />
                          </SelectTrigger>
                          <SelectContent>
                            {styles.map(
                              (value, index) =>
                                value.id < 6 && (
                                  <SelectItem
                                    key={`style_${index}`}
                                    value={String(value.id)}
                                  >
                                    {value.label}
                                  </SelectItem>
                                ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {watchDistance > 6 && (
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>種目</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="種目" {...field} />
                          </SelectTrigger>
                          <SelectContent>
                            {styles.map(
                              (value, index) =>
                                value.id >= 6 && (
                                  <SelectItem
                                    key={`style_${index}`}
                                    value={String(value.id)}
                                  >
                                    {value.label}
                                  </SelectItem>
                                ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="time"
                render={() => (
                  <FormItem>
                    <FormLabel>タイム</FormLabel>
                    <FormControl>
                      <div className="grid justify-center-safe align-text-bottom">
                        <InputOTP
                          maxLength={6}
                          inputMode="numeric"
                          pattern={REGEXP_ONLY_DIGITS}
                          onChange={(value) => {
                            return form.setValue("time", Number(value));
                          }}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchDistance <= 6 ? (
                <FormField
                  control={form.control}
                  name="swimmer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>選手名</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="選手名"
                          {...register("swimmer1")}
                        />
                      </FormControl>
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
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="第1泳者"
                            {...register("swimmer1")}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="第2泳者"
                            {...register("swimmer2")}
                            // value={field.value !== null ? field.value : ""}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="第3泳者"
                            {...register("swimmer3")}
                            // value={field.value !== null ? field.value : ""}
                          />
                        </FormControl>
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
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="第4泳者"
                            {...register("swimmer4")}
                            // value={field.value !== null ? field.value : ""}
                          />
                        </FormControl>
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
                    <FormControl>
                      <Input type="text" placeholder="チーム名" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="text" placeholder="大会名" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="text" placeholder="大会会場" {...field} />
                    </FormControl>
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
                    <FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
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
                )}
              />
              <div className="aspect-video max-w-140">
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
