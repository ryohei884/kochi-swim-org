"use client";

import { useState, useEffect, Fragment } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { init } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { PencilLine } from "lucide-react";
import { CalendarIcon, Plus, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import type { meetUpdateOnSubmitSchemaType } from "@/lib/meet/verification";
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
import { Textarea } from "@/components/ui/textarea";
import { getById, update } from "@/lib/meet/actions";
import {
  meetUpdateOnSubmitSchemaDV,
  meetUpdateOnSubmitSchema,
} from "@/lib/meet/verification";
import { cn, meetKind, poolSize } from "@/lib/utils";

interface Props {
  id: string;
  fetchListData: (id: string) => Promise<void>;
}

export default function MeetUpdateForm(props: Props) {
  const { id, fetchListData } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);

  const form = useForm<meetUpdateOnSubmitSchemaType>({
    resolver: zodResolver(meetUpdateOnSubmitSchema),
    defaultValues: meetUpdateOnSubmitSchemaDV,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dialogOpen && fetchData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  const fetchData = async (id: string) => {
    setIsReady(false);
    const res = await getById({ id: id });
    if (res !== null) {
      reset({
        ...res,
        poolsize: String(res.poolsize),
        kind: String(res.kind),
        detail: res.detail !== null ? JSON.parse(String(res.detail)) : [],
        attachment:
          res.attachment !== null ? JSON.parse(String(res.attachment)) : [],
      });
      setIsReady(true);
    }
  };

  const onSubmit: SubmitHandler<meetUpdateOnSubmitSchemaType> = async (
    data: meetUpdateOnSubmitSchemaType,
  ) => {
    console.log(data);

    const detailBlob = await uploadFile(data.detail);
    const attachmentBlob = await uploadFile(data.attachment);

    const res = await update({
      ...data,
      poolsize: Number(data.poolsize),
      kind: Number(data.kind),
      detail: JSON.stringify(detailBlob),
      attachment: JSON.stringify(attachmentBlob),
    });

    toast("更新しました。", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    fetchListData(res.id);
    setDialogOpen(false);
    reset();
  };

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
            },
          );

          const resBlob = (await response.json()) as PutBlobResult;
          return { value: resBlob.url, name: prop.name };
        } else if (!!prop.value && typeof prop.value === "string") {
          return { value: prop.value, name: prop.name };
        } else {
          return null;
        }
      }),
    );
    return blob.filter(Boolean);
  };

  const onError: SubmitErrorHandler<meetUpdateOnSubmitSchemaType> = async (
    errors,
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
        <Button variant="ghost" size="sm">
          <PencilLine />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea className="h-dvh pr-2">
          <SheetHeader>
            <SheetTitle>競技会情報編集</SheetTitle>
            <SheetDescription className="sr-only">
              競技会情報編集画面
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
                    <FormControl hidden={!isReady}>
                      <Input
                        type="text"
                        placeholder="大会コード"
                        {...field}
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
                control={control}
                name="kind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>競技種目</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
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
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                    />
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
                control={control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>開始日</FormLabel>
                    <Popover open={openFromDate}>
                      <PopoverTrigger asChild>
                        <FormControl hidden={!isReady}>
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
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenFromDate(false);
                          }}
                          // disabled={(date) => date <= new Date()}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
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
                        <FormControl hidden={!isReady}>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
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
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
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
                        <FormControl hidden={!isReady}>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
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
                      <Skeleton
                        hidden={isReady}
                        className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                      />
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
                    <FormControl hidden={!isReady}>
                      <Input type="text" placeholder="プール名" {...field} />
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
                control={control}
                name="poolsize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>水路</FormLabel>
                    <FormControl hidden={!isReady}>
                      <Select
                        onValueChange={field.onChange}
                        value={String(field.value)}
                      >
                        <SelectTrigger className="w-full" hidden={!isReady}>
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
                    <Skeleton
                      hidden={isReady}
                      className="flex h-9 w-full border border-input px-3 py-2 file:border-0 max-w-full"
                    />
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
                    <FormControl hidden={!isReady}>
                      <Textarea
                        {...field}
                        value={field.value ? field.value : ""}
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
              <FormItem>
                <FormLabel>要項ファイル</FormLabel>
                {detailFields.map((field, index) => {
                  return (
                    <Fragment key={field.id}>
                      <div className="inline-flex mb-4 min-w-full">
                        <div className="inline-block w-full">
                          <Input
                            {...register(`detail.${index}.value`)}
                            type="file"
                            placeholder="要項ファイル"
                            className="mb-2"
                            hidden={typeof field.value === "string"}
                          />
                          <Input
                            {...register(`detail.${index}.name`)}
                            type="text"
                            placeholder="要項ファイル表示名"
                            defaultValue={form.getValues(
                              `detail.${index}.name`,
                            )}
                            className="mb-2"
                          />
                        </div>
                        {typeof field.value === "string" && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="ml-2"
                            asChild
                          >
                            <Link
                              href={field.value}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
                  );
                })}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                      e.preventDefault();
                      detailAppend({ value: undefined, name: "" });
                    }}
                    variant="ghost"
                  >
                    <Plus size={4} />
                  </Button>
                </div>
              </FormItem>
              <FormItem>
                <FormLabel>添付ファイル</FormLabel>
                {attachmentFields.map((field, index) => {
                  return (
                    <Fragment key={field.id}>
                      <div className="inline-flex mb-4 min-w-full">
                        <div className="inline-block w-full">
                          <Input
                            {...register(`attachment.${index}.value`)}
                            type="file"
                            placeholder="添付ファイル"
                            className="mb-2"
                            hidden={typeof field.value === "string"}
                          />
                          <Input
                            {...register(`attachment.${index}.name`)}
                            type="text"
                            placeholder="添付ファイル表示名"
                            defaultValue={form.getValues(
                              `attachment.${index}.name`,
                            )}
                            className="mb-2"
                          />
                        </div>
                        {typeof field.value === "string" && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="ml-2"
                            asChild
                          >
                            <Link
                              href={field.value}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
                  );
                })}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                      e.preventDefault();
                      attachmentAppend({ value: undefined, name: "" });
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
                  {form.formState.isSubmitting ? "送信中" : "更新"}
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
