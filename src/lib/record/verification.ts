import { z } from "zod";

// userSchema
export const userSchema = z.object({
  image: z.string().nullable(),
  name: z.string().nullable(),
  displayName: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  id: z.string().nonoptional(),
  role: z.string().nonoptional(),
  email: z.string().nonoptional(),
  emailVerified: z.date().nullable(),
});

export type userSchemaType = z.infer<typeof userSchema>;

export const userSchemaDV: userSchemaType = {
  image: "",
  name: "",
  displayName: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "",
  role: "",
  email: "",
  emailVerified: null,
};

// recordSchema
export const recordSchema = z.object({
  id: z.string(),
  category: z
    .transform(Number)
    .pipe(
      z
        .number("選択肢から選んでください。")
        .int("選択肢から選んでください。")
        .positive("選択肢から選んでください。"),
    ),
  poolsize: z
    .transform(Number)
    .pipe(
      z
        .number("選択肢から選んでください。")
        .int("選択肢から選んでください。")
        .positive("選択肢から選んでください。"),
    ),
  sex: z
    .transform(Number)
    .pipe(
      z
        .number("選択肢から選んでください。")
        .int("選択肢から選んでください。")
        .positive("選択肢から選んでください。"),
    ),
  style: z
    .transform(Number)
    .pipe(
      z
        .number("選択肢から選んでください。")
        .int("選択肢から選んでください。")
        .positive("選択肢から選んでください。"),
    ),
  distance: z
    .transform(Number)
    .pipe(
      z
        .number("選択肢から選んでください。")
        .int("選択肢から選んでください。")
        .positive("選択肢から選んでください。"),
    ),
  time: z
    .transform(Number)
    .pipe(
      z
        .number("数字を入力してください。")
        .int("整数を入力してください。")
        .positive("自然数を入力してください。"),
    ),
  swimmer1: z
    .string()
    .min(2, {
      message: "選手名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "選手名は128文字以下で入力してください。",
    }),
  swimmer2: z.string().nullable(),
  swimmer3: z.string().nullable(),
  swimmer4: z.string().nullable(),
  team: z
    .string()
    .min(2, {
      message: "チーム名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "チーム名は128文字以下で入力してください。",
    }),
  place: z
    .string()
    .min(2, {
      message: "会場名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "会場名は128文字以下で入力してください。",
    }),
  date: z.date(),
  meetName: z
    .string()
    .min(2, {
      message: "大会名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "大会名は128文字以下で入力してください。",
    }),
  valid: z.boolean(),
  image: z.string().nullable(),
  createdUserId: z.string(),
  revisedUserId: z.string().nullable(),
  approvedUserId: z.string().nullable(),
  approved: z.boolean(),
  createdAt: z.date(),
  revisedAt: z.date(),
  approvedAt: z.date().nullable(),
});

export type recordSchemaType = z.infer<typeof recordSchema>;

export const recordSchemaDV: recordSchemaType = {
  id: "",
  category: 0,
  poolsize: 0,
  sex: 0,
  style: 0,
  distance: 0,
  time: 0,
  swimmer1: "",
  swimmer2: null,
  swimmer3: null,
  swimmer4: null,
  team: "",
  place: "",
  date: new Date(),
  meetName: "",
  valid: false,
  image: null,
  createdUserId: "",
  revisedUserId: null,
  approvedUserId: null,
  approved: false,
  createdAt: new Date(),
  revisedAt: new Date(),
  approvedAt: null,
};

// recordWithUserSchema
export const recordWithUserSchema = recordSchema.extend({
  createdUser: userSchema,
  revisedUser: userSchema.nullable(),
  approvedUser: userSchema.nullable(),
});

export type recordWithUserSchemaType = z.infer<typeof recordWithUserSchema>;

export const recordWithUserSchemaDV: recordWithUserSchemaType = {
  ...recordSchemaDV,
  createdUser: userSchemaDV,
  revisedUser: null,
  approvedUser: null,
};

// recordCreateSchema
export const recordCreateSchema = recordSchema.omit({
  id: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdUserId: true,
});

export type recordCreateSchemaType = z.infer<typeof recordCreateSchema>;

export const recordCreateSchemaDV: recordCreateSchemaType = {
  category: recordSchemaDV.category,
  poolsize: recordSchemaDV.poolsize,
  sex: recordSchemaDV.sex,
  style: recordSchemaDV.style,
  distance: recordSchemaDV.distance,
  time: recordSchemaDV.time,
  swimmer1: recordSchemaDV.swimmer1,
  swimmer2: recordSchemaDV.swimmer2,
  swimmer3: recordSchemaDV.swimmer3,
  swimmer4: recordSchemaDV.swimmer4,
  team: recordSchemaDV.team,
  place: recordSchemaDV.place,
  date: recordSchemaDV.date,
  meetName: recordSchemaDV.meetName,
  image: recordSchemaDV.image,
  valid: recordSchemaDV.valid,
};

// recordUpdateSchema
export const recordUpdateSchema = recordSchema.omit({
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdUserId: true,
});

export type recordUpdateSchemaType = z.infer<typeof recordUpdateSchema>;

export const recordUpdateSchemaDV: recordUpdateSchemaType = {
  id: recordSchemaDV.id,
  category: recordSchemaDV.category,
  poolsize: recordSchemaDV.poolsize,
  sex: recordSchemaDV.sex,
  style: recordSchemaDV.style,
  distance: recordSchemaDV.distance,
  time: recordSchemaDV.time,
  swimmer1: recordSchemaDV.swimmer1,
  swimmer2: recordSchemaDV.swimmer2,
  swimmer3: recordSchemaDV.swimmer3,
  swimmer4: recordSchemaDV.swimmer4,
  team: recordSchemaDV.team,
  place: recordSchemaDV.place,
  date: recordSchemaDV.date,
  meetName: recordSchemaDV.meetName,
  image: recordSchemaDV.image,
  valid: recordSchemaDV.valid,
};

// recordExcludeSchema
export const recordExcludeSchema = recordSchema.omit({
  category: true,
  poolsize: true,
  sex: true,
  style: true,
  distance: true,
  time: true,
  swimmer1: true,
  swimmer2: true,
  swimmer3: true,
  swimmer4: true,
  team: true,
  place: true,
  date: true,
  meetName: true,
  valid: true,
  image: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
});

export type recordExcludeSchemaType = z.infer<typeof recordExcludeSchema>;

export const recordExcludeSchemaDV: recordExcludeSchemaType = {
  id: recordSchemaDV.id,
};

// recordApproveSchema
export const recordApproveSchema = recordSchema.omit({
  category: true,
  poolsize: true,
  sex: true,
  style: true,
  distance: true,
  time: true,
  swimmer1: true,
  swimmer2: true,
  swimmer3: true,
  swimmer4: true,
  team: true,
  place: true,
  date: true,
  meetName: true,
  valid: true,
  image: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
});

export type recordApproveSchemaType = z.infer<typeof recordApproveSchema>;

export const recordApproveSchemaDV: recordApproveSchemaType = {
  id: recordSchemaDV.id,
};
