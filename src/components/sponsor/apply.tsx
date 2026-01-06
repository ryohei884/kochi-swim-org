"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitErrorHandler } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const POST_CODE = new RegExp("^[0-9]{3}-[0-9]{4}$");
const TELEPHONE_NUMBER = new RegExp("^[0-9]+-?[0-9]+-?[0-9]+$");
const formSchema = z.object({
  companyName: z
    .string()
    .min(1, "法人・事業所名は1文字以上で入力してください。")
    .max(128, "法人・事業所名は128文字以下で入力してください。"),
  contactName: z
    .string()
    .min(1, "ご担当者名は1文字以上で入力してください。")
    .max(128, "ご担当者名は128文字以下で入力してください。"),
  address: z
    .string()
    .min(1, "住所は1文字以上で入力してください。")
    .max(256, "住所は256文字以下で入力してください。"),
  postalCode: z
    .string()
    .regex(
      POST_CODE,
      "半角数字、ハイフン付きで入力してください（例: 123-4567）",
    )
    .min(8, "郵便番号は8文字以上で入力してください。")
    .max(8, "郵便番号は8文字以上で入力してください。"),
  telephone: z
    .string()
    .regex(
      TELEPHONE_NUMBER,
      "半角数字、ハイフン付きで入力してください（例: 088-800-0000）",
    )
    .min(10, "電話番号は10文字以上で入力してください。")
    .max(12, "電話番号は12文字以下で入力してください。"),
  fax: z.string().nullable(),
  // .regex(
  //   TELEPHONE_NUMBER,
  //   "半角数字、ハイフン付きで入力してください（例: 088-800-0000）",
  // )
  // .min(10, "FAX番号は10文字以上で入力してください。")
  // .max(12, "FAX番号は12文字以下で入力してください。"),
  email: z.email("正しいメールアドレスを入力してください。"),
  advertisementSize: z.string().min(0, "プランを選んでください。"),
  fedContactPerson: z.string().nullable(),
  // .min(1, "ご担当者名は1文字以上で入力してください。")
  // .max(128, "ご担当者名は128文字以下で入力してください。"),
  howtoSendYourManuscript: z.string().min(0, "送付方法を選んでください。"),
});

export const plans = [
  { label: "Aプラン(年60,000円)", value: "a" },
  { label: "Bプラン(年50,000円)", value: "b" },
  { label: "Cプラン(年45,000円)", value: "c" },
  { label: "Dプラン(年40,000円)", value: "d" },
  { label: "Eプラン(年25,000円)", value: "e" },
  { label: "Fプラン(年10,000円)", value: "f" },
] as { label: string; value: string }[];

export const submit = [
  { label: "Eメールで送付", value: "email" },
  { label: "郵送(原稿返却希望)", value: "postal_with_return" },
  { label: "郵送(原稿返却不要)", value: "postal_no_return" },
] as { label: string; value: string }[];

interface Props {
  plan: "a" | "b" | "c" | "d" | "e" | "f";
}
export function ApplyForm(props: Props) {
  const { plan } = props;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      address: "",
      postalCode: "",
      telephone: "",
      fax: "",
      email: "",
      advertisementSize: plan,
      fedContactPerson: "",
      howtoSendYourManuscript: "email",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await sendMessageViaEmail(data);
    toast("広告掲載のお申し込みを受け付けました。", {
      description: (
        <div>
          お手続き方法について担当者から連絡いたしますので、しばらくお待ちください。
        </div>
      ),
    });
  }

  const sendMessageViaEmail = async (data: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/advertising-sponsorship", {
      method: "POST",
      body: JSON.stringify({
        data,
      }),
    });
    return response;
  };

  const onError: SubmitErrorHandler<typeof formSchema> = (errors) => {
    toast("エラーが発生しました。", {
      description: (
        <div>
          お手数をおかけして申し訳ありませんが、お問い合わせからご連絡ください。
        </div>
      ),
    });
  };

  return (
    <form
      id="form-rhf-apply"
      onSubmit={form.handleSubmit(onSubmit, onError)}
      className="w-full sm:max-w-md"
    >
      <FieldGroup>
        <Controller
          name="advertisementSize"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="advertisementSize">
                  広告掲載サイズ
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="advertisementSize"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {plans.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="companyName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="companyName">法人名・事業所名</FieldLabel>
              <Input
                {...field}
                id="companyName"
                aria-invalid={fieldState.invalid}
                placeholder="法人名・事業所名"
                autoComplete="on"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contactName">ご担当者名</FieldLabel>
              <Input
                {...field}
                id="contactName"
                aria-invalid={fieldState.invalid}
                placeholder="ご担当者名"
                autoComplete="on"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="grid md:grid-cols-4 gap-4">
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="postalCode">郵便番号</FieldLabel>
                <Input
                  {...field}
                  id="postalCode"
                  aria-invalid={fieldState.invalid}
                  placeholder="781-0000"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="md:col-span-3"
              >
                <FieldLabel htmlFor="address">住所</FieldLabel>
                <Input
                  {...field}
                  id="address"
                  aria-invalid={fieldState.invalid}
                  placeholder="高知県高知市"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </Field>
        <Field className="grid md:grid-cols-2 gap-4">
          <Controller
            name="telephone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="telephone">電話番号</FieldLabel>
                <Input
                  {...field}
                  id="telephone"
                  aria-invalid={fieldState.invalid}
                  placeholder="088-000-0000"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="fax"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fax">FAX番号</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  id="fax"
                  placeholder="088-000-0000"
                  autoComplete="on"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </Field>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Eメールアドレス</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="a@example.com"
                autoComplete="on"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fedContactPerson"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fedContactPerson">本連盟担当者名</FieldLabel>
              <Input
                {...field}
                value={field.value || ""}
                id="fedContactPerson"
                aria-invalid={fieldState.invalid}
                placeholder="吉川 彰二郎"
                autoComplete="on"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="howtoSendYourManuscript"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="howtoSendYourManuscript">
                  原稿送付方法
                </FieldLabel>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="howtoSendYourManuscript"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {submit.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Field>
          <Button type="submit">広告掲載申込</Button>
          <FieldDescription className="text-center">
            お申し込み後に担当者から連絡差し上げます。
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
