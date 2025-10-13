"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { contactSchemaType } from "@/lib/contact/verification";
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
import { Textarea } from "@/components/ui/textarea";
import { contactSchemaDV, contactSchema } from "@/lib/contact/verification";

export default function ContactForm() {
  const sendMessageViaLine = async (data: contactSchemaType) => {
    const response = await fetch("/api/line", {
      method: "POST",
      body: JSON.stringify({
        data,
      }),
    });
    return response;
  };

  const form = useForm<contactSchemaType>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactSchemaDV,
  });

  const onSubmit: SubmitHandler<contactSchemaType> = async (
    data: contactSchemaType,
  ) => {
    await sendMessageViaLine(data);
    toast("お問い合わせを送信しました。", {
      description: (
        <div>担当者が速やかに対応いたしますので、しばらくお待ちください。</div>
      ),
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    form.reset();
  };

  const onError: SubmitErrorHandler<contactSchemaType> = (errors) => {
    toast("エラーが発生しました。", {
      description: <div>{JSON.stringify(errors, null, 2)}</div>,
      action: {
        label: "Undo",
        onClick: () => console.log(errors),
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block dark:fill-gray-900"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative z-20 px-6 lg:px-8 py-24 sm:py-32">
              <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                  お問い合わせ
                </h2>
                <p className="mt-2 text-lg/8 text-gray-600 dark:text-gray-400">
                  お気軽にお問い合わせください。
                </p>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit, onError)}
                    className="space-y-8 mt-8"
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                              姓
                            </FormLabel>
                            <FormControl className="mt-2.5">
                              <Input
                                type="text"
                                autoComplete="family-name"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                              名
                            </FormLabel>
                            <FormControl className="mt-2.5">
                              <Input
                                type="text"
                                autoComplete="given-name"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="affiliation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                              所属
                            </FormLabel>
                            <FormControl className="mt-2.5">
                              <Input
                                type="text"
                                autoComplete="organization"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                              メールアドレス
                            </FormLabel>
                            <FormControl className="mt-2.5">
                              <Input
                                type="email"
                                {...field}
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between text-sm/6">
                              <FormLabel className="block font-semibold text-gray-900 dark:text-white">
                                電話番号
                              </FormLabel>
                              <p
                                id="phone-description"
                                className="text-gray-400 dark:text-gray-500"
                              >
                                Optional
                              </p>
                            </div>
                            <FormControl>
                              <Input
                                type="text"
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm/6 font-semibold text-gray-900 dark:text-white">
                              本文
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                                rows={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8 dark:border-white/10">
                      <Button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                      >
                        お問い合わせを送信
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 dark:bg-gray-800">
          <Image
            alt=""
            width={738}
            height={1067}
            priority={true}
            src="/swim_club.jpg"
            className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
          />
        </div>
      </div>
    </div>
  );
}
