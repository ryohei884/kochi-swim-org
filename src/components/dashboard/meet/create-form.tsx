"use client";
import { useState, useEffect, Fragment } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import type { meetCreateOnSubmitSchemaType } from "@/lib/meet/verification";
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
import { Textarea } from "@/components/ui/textarea";
import { create } from "@/lib/meet/actions";
import {
  meetCreateOnSubmitSchema,
  meetCreateOnSubmitSchemaDV,
} from "@/lib/meet/verification";
import { cn, meetKind, poolSize } from "@/lib/utils";

interface Props {
  fetchListData: (id: string) => Promise<void>;
}

export default function MeetCreateForm(props: Props) {
  const { fetchListData } = props;
  const [isReady, setIsReady] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);

  const form = useForm<meetCreateOnSubmitSchemaType>({
    resolver: zodResolver(meetCreateOnSubmitSchema),
    defaultValues: meetCreateOnSubmitSchemaDV,
  });

  const { register, control, handleSubmit, reset } = form;

  const {
    fields: detailFields,
    append: detailAppend,
    remove: detailRemove,
  } = useFieldArray({
    control,
    name: "detail",
  });

  const {
    fields: attachmentFields,
    append: attachmentAppend,
    remove: attachmentRemove,
  } = useFieldArray({
    control,
    name: "attachment",
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  type UploadFileProps = {
    value?: string | FileList;
    name: string;
  }[];

  const uploadFile = async (props: UploadFileProps) => {
    const blob = await Promise.all(
      props.map(async (prop) => {
        if (
          !!prop.value &&
          typeof prop.value !== "string" &&
          prop.value.length > 0
        ) {
          const filename = init({ length: 8 });
          const propName: string = prop.value[0].name;
          const extension = propName.slice(propName.lastIndexOf(".") + 1);

          const response = await fetch(
            `/api/meet/file/upload?filename=files/${filename()}.${extension}`,
            {
              method: "POST",
              body: prop.value[0],
            }
          );

          const resBlob = (await response.json()) as PutBlobResult;
          return { value: resBlob.url, name: prop.name };
        } else {
          return null;
        }
      })
    );
    return blob.filter(Boolean);
  };

  const onSubmit: SubmitHandler<meetCreateOnSubmitSchemaType> = async (
    data: meetCreateOnSubmitSchemaType
  ) => {
    const detailBlob = await uploadFile(data.detail);
    const attachmentBlob = await uploadFile(data.attachment);

    const res = await create({
      ...data,
      poolsize: Number(data.poolsize),
      kind: Number(data.kind),
      detail: JSON.stringify(detailBlob),
      attachment: JSON.stringify(attachmentBlob),
    });

    toast("作成しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res.id);
    setDialogOpen(false);
    reset();
  };

  const onError: SubmitErrorHandler<meetCreateOnSubmitSchemaType> = (
    errors
  ) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: (e) => {
          e.preventDefault();
          setDialogOpen(false);
          console.log(errors);
        },
      },
    });
  };

  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger className="align-middle" asChild>
        <Button variant="outline" size="sm">
          <Plus /> 競技会情報作成
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>競技会情報作成</SheetTitle>
            <SheetDescription className="sr-only">
              競技会情報作成画面
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-8 p-4"
            >
              <FormField
                control={control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>大会コード</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="大会コード"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="kind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>競技種目</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="競技種目" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {meetKind.map((value, index) => (
                            <SelectItem key={index} value={String(value.id)}>
                              {value.kind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="title"
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
                control={control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日</FormLabel>
                    <Popover open={openFromDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                control={control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>終了日</FormLabel>
                    <Popover open={openToDate}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={(date) => {
                              field.onChange(date);
                              setOpenToDate(true);
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
                          selected={field.value ? field.value : undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenToDate(false);
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
                control={control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>申込締切日</FormLabel>
                    <Popover open={openDeadline}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            onClick={(date) => {
                              field.onChange(date);
                              setOpenDeadline(true);
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
                          selected={field.value ? field.value : undefined}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenDeadline(false);
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
                control={control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プール名</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="プール名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="poolsize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>水路</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="水路" {...field} />
                        </SelectTrigger>
                        <SelectContent>
                          {poolSize.map((value, index) => (
                            <SelectItem key={index} value={String(value.id)}>
                              {value.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細説明文</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ? field.value : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>要項ファイル</FormLabel>
                {detailFields.map((field, index) => (
                  <Fragment key={field.id}>
                    <div className="inline-flex mb-0">
                      <div>
                        <Input
                          {...register(`detail.${index}.value`)}
                          type="file"
                          placeholder="要項ファイル"
                          className="mb-2"
                        />
                        <Input
                          {...register(`detail.${index}.name`)}
                          type="text"
                          placeholder="要項ファイル表示名"
                          defaultValue={form.getValues(`detail.${index}.name`)}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.preventDefault();
                          detailRemove(index);
                        }}
                        variant="ghost"
                        className="ml-2"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      detailAppend({ value: "", name: "" });
                    }}
                    variant="ghost"
                  >
                    <Plus size={4} />
                  </Button>
                </div>
              </FormItem>
              <FormItem>
                <FormLabel>添付ファイル</FormLabel>
                {attachmentFields.map((field, index) => (
                  <Fragment key={field.id}>
                    <div className="inline-flex mb-0">
                      <div>
                        <Input
                          {...register(`attachment.${index}.value`)}
                          type="file"
                          placeholder="要項ファイル"
                          className="mb-2"
                        />
                        <Input
                          {...register(`attachment.${index}.name`)}
                          type="text"
                          placeholder="添付ファイル表示名"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => {
                          e.preventDefault();
                          attachmentRemove(index);
                        }}
                        variant="ghost"
                        className="ml-2"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      e.preventDefault();
                      attachmentAppend({ value: "", name: "" });
                    }}
                    variant="ghost"
                  >
                    <Plus size={4} />
                  </Button>
                </div>
              </FormItem>
              <SheetFooter className="p-0">
                <Button
                  type="submit"
                  disabled={!isReady || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "送信中" : "作成"}
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    キャンセル
                  </Button>
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
