import { z } from "zod";

// userSchema
export const userSchema = z.object({
  image: z.string().nullable(),
  name: z.string().nullable(),
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
  createdAt: new Date(),
  updatedAt: new Date(),
  id: "",
  role: "",
  email: "",
  emailVerified: null,
};

// categorySchema
export const categorySchema = z.object({
  id: z.string().nonoptional("作成者IDを入力してください。"),
  name: z
    .string()
    .min(1, {
      message: "カテゴリー名は1文字以上で入力してください。",
    })
    .max(128, {
      message: "カテゴリー名は128文字以下で入力してください。",
    }),
  link: z
    .string()
    .min(1, {
      message: "URLは1文字以上で入力してください。",
    })
    .max(16, {
      message: "URLは16文字以下で入力してください。",
    })
    .regex(/^\w*$/, { message: "半角英数字のみ使えます。" }),
  order: z
    .transform(Number)
    .pipe(
      z
        .number("数字を入力してください。")
        .int("整数を入力してください。")
        .positive("自然数を入力してください。"),
    ),
  role: z
    .transform(Number)
    .pipe(
      z
        .number("数字を入力してください。")
        .int("整数を入力してください。")
        .positive("選択してください。"),
    ),
  createdAt: z.date("日付を入力してください。"),
  updatedAt: z.date("日付を入力してください。"),
  createdUserId: z.string("作成者IDを入力してください。"),
  updatedUserId: z.string("更新者IDを入力してください。").nullable(),
});

export type categorySchemaType = z.infer<typeof categorySchema>;

export const categorySchemaDV: categorySchemaType = {
  id: "",
  name: "",
  link: "",
  order: 0,
  role: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdUserId: "",
  updatedUserId: null,
};

// categoryWithUserSchema
export const categoryWithUserSchema = categorySchema.extend({
  createdUser: userSchema,
  updatedUser: userSchema.nullable(),
});

export type categoryWithUserSchemaType = z.infer<typeof categoryWithUserSchema>;

export const categoryWithUserSchemaDV: categoryWithUserSchemaType = {
  createdUser: userSchemaDV,
  updatedUser: null,
  ...categorySchemaDV,
};

// categoryCreateSchema
export const categoryCreateSchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
});

export type categoryCreateSchemaType = z.infer<typeof categoryCreateSchema>;

export const categoryCreateSchemaDV: categoryCreateSchemaType = {
  name: categorySchemaDV.name,
  link: categorySchemaDV.name,
  order: categorySchemaDV.order,
  role: categorySchemaDV.role,
};

// categoryUpdateSchema
export const categoryUpdateSchema = categorySchema.omit({
  createdAt: true,
  updatedAt: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type categoryUpdateSchemaType = z.infer<typeof categoryUpdateSchema>;

export const categoryUpdateSchemaDV: categoryUpdateSchemaType = {
  id: categorySchemaDV.id,
  name: categorySchemaDV.name,
  link: categorySchemaDV.link,
  order: categorySchemaDV.order,
  role: categorySchemaDV.role,
  createdUserId: categorySchemaDV.createdUserId,
};

// categoryGetByIdSchema
export const categoryGetByIdSchema = categorySchema.omit({
  name: true,
  link: true,
  order: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type categoryGetByIdSchemaType = z.infer<typeof categoryGetByIdSchema>;

export const categoryGetByIdSchemaDV: categoryGetByIdSchemaType = {
  id: categorySchemaDV.id,
};

// categoryExcludeSchema
export const categoryExcludeSchema = categorySchema.omit({
  name: true,
  link: true,
  order: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type categoryExcludeSchemaType = z.infer<typeof categoryExcludeSchema>;

export const categoryExcludeSchemaDV: categoryExcludeSchemaType = {
  id: categorySchemaDV.id,
};
