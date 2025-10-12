import { z } from "zod";
import { userSchema, userSchemaDV } from "@/lib/news/verification";
import { meetSchema, meetSchemaDV } from "@/lib/meet/verification";

// liveSchema
export const liveSchema = z.object({
  id: z.string(),
  title: z.string(),
  fromDate: z.date().nonoptional(),
  meetId: z.string().nullable(),
  onAir: z.boolean(),
  url: z.string().nullable(),
  order: z
    .transform(Number)
    .pipe(
      z
        .number("数字を入力してください。")
        .int("整数を入力してください。")
        .positive("自然数を入力してください。"),
    ),
  finished: z.boolean(),
  createdUserId: z.string(),
  createdAt: z.date().nonoptional(),
  updatedAt: z.date().nonoptional(),
});

export type liveSchemaType = z.infer<typeof liveSchema>;

export const liveSchemaDV: liveSchemaType = {
  id: "",
  title: "",
  fromDate: new Date(),
  meetId: null,
  onAir: false,
  url: "",
  order: 0,
  finished: false,
  createdUserId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// liveWithUserSchema
export const liveWithUserSchema = liveSchema.extend({
  createdUser: userSchema,
  meet: meetSchema.nullable(),
});

export type liveWithUserSchemaType = z.infer<typeof liveWithUserSchema>;

export const liveWithUserSchemaDV: liveWithUserSchemaType = {
  ...liveSchemaDV,
  meet: meetSchemaDV,
  createdUser: userSchemaDV,
};

// liveCreateSchema
export const liveCreateSchema = liveSchema.omit({
  id: true,
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
});

export type liveCreateSchemaType = z.infer<typeof liveCreateSchema>;

export const liveCreateSchemaDV: liveCreateSchemaType = {
  title: liveSchemaDV.title,
  fromDate: liveSchemaDV.fromDate,
  meetId: liveSchemaDV.meetId,
  onAir: liveSchemaDV.onAir,
  url: liveSchemaDV.url,
  order: liveSchemaDV.order,
  finished: liveSchemaDV.finished,
};

// liveUpdateSchema
export const liveUpdateSchema = liveSchema.omit({
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
});

export type liveUpdateSchemaType = z.infer<typeof liveUpdateSchema>;

export const liveUpdateSchemaDV: liveUpdateSchemaType = {
  id: liveSchemaDV.id,
  title: liveSchemaDV.title,
  fromDate: liveSchemaDV.fromDate,
  meetId: liveSchemaDV.meetId,
  onAir: liveSchemaDV.onAir,
  url: liveSchemaDV.url,
  order: liveSchemaDV.order,
  finished: liveSchemaDV.finished,
};

// liveGetByIdSchema
export const liveGetByIdSchema = liveSchema.omit({
  title: true,
  fromDate: true,
  meetId: true,
  onAir: true,
  url: true,
  order: true,
  finished: true,
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
});

export type liveGetByIdSchemaType = z.infer<typeof liveGetByIdSchema>;

export const liveGetByIdSchemaDV: liveGetByIdSchemaType = {
  id: liveSchemaDV.id,
};

// liveExcludeSchema
export const liveExcludeSchema = liveSchema.omit({
  title: true,
  fromDate: true,
  meetId: true,
  onAir: true,
  url: true,
  order: true,
  finished: true,
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
});

export type liveExcludeSchemaType = z.infer<typeof liveExcludeSchema>;

export const liveExcludeSchemaDV: liveExcludeSchemaType = {
  id: liveSchemaDV.id,
};
