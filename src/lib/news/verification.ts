import { z } from "zod/v4";

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

// newsSchema
export const newsSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(2, {
      message: "題名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "題名は128文字以下で入力してください。",
    }),
  detail: z
    .string()
    .min(2, {
      message: "本文は2文字以上で入力してください。",
    })
    .max(32768, {
      message: "本文は32768文字以下で入力してください。",
    }),
  image: z.string().nullable(),
  fromDate: z.date().nonoptional({
    error: "掲載開始日は必須項目です。",
  }),
  toDate: z.date().nullable(),
  link: z.string().nullable(),
  createdUserId: z.string(),
  revisedUserId: z.string().nullable(),
  approvedUserId: z.string().nullable(),
  approved: z.boolean(),
  createdAt: z.date(),
  revisedAt: z.date(),
  approvedAt: z.date().nullable(),
});

export type newsSchemaType = z.infer<typeof newsSchema>;

export const newsSchemaDV: newsSchemaType = {
  id: "",
  title: "",
  detail: "",
  image: null,
  fromDate: new Date(),
  toDate: null,
  link: null,
  createdUserId: "",
  revisedUserId: "",
  approvedUserId: "",
  approved: false,
  createdAt: new Date(),
  revisedAt: new Date(),
  approvedAt: null,
};

// newsWithUserSchema
export const newsWithUserSchema = newsSchema.extend({
  createdUser: userSchema,
  revisedUser: userSchema.nullable(),
  approvedUser: userSchema.nullable(),
});

export type newsWithUserSchemaType = z.infer<typeof newsWithUserSchema>;

export const newsWithUserSchemaDV: newsWithUserSchemaType = {
  id: newsSchemaDV.id,
  title: newsSchemaDV.title,
  detail: newsSchemaDV.detail,
  image: newsSchemaDV.image,
  fromDate: newsSchemaDV.fromDate,
  toDate: newsSchemaDV.toDate,
  link: newsSchemaDV.link,
  createdUserId: newsSchemaDV.createdUserId,
  revisedUserId: newsSchemaDV.revisedUserId,
  approvedUserId: newsSchemaDV.approvedUserId,
  approved: newsSchemaDV.approved,
  createdAt: newsSchemaDV.createdAt,
  revisedAt: newsSchemaDV.revisedAt,
  approvedAt: newsSchemaDV.approvedAt,
  createdUser: userSchemaDV,
  revisedUser: null,
  approvedUser: null,
};

// newsCreateSchema
export const newsCreateSchema = newsSchema.omit({
  id: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
});

export type newsCreateSchemaType = z.infer<typeof newsCreateSchema>;

export const newsCreateSchemaDV: newsCreateSchemaType = {
  title: newsSchemaDV.title,
  detail: newsSchemaDV.detail,
  image: null,
  fromDate: newsSchemaDV.fromDate,
  toDate: newsSchemaDV.toDate,
  link: newsSchemaDV.link,
  createdUserId: newsSchemaDV.createdUserId,
};

// newsCreateOnSubmitSchema
export const newsCreateOnSubmitSchema = newsSchema
  .omit({
    id: true,
    createdAt: true,
    revisedAt: true,
    approvedAt: true,
    revisedUserId: true,
    approvedUserId: true,
    approved: true,
    image: true,
  })
  .extend({
    image: z
      .custom<FileList>()
      .transform((file) => file[0])
      .nullable()
      .refine((file) => !file || file.size <= 512 * 1024 * 1024, {
        message: "ファイルサイズは最大512MBです",
      })
      .refine(
        (file) =>
          !file ||
          [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/svg+xml",
            "image/gif",
          ].includes(file.type),
        {
          message: ".jpg, .png, .gif, svgのみ利用可能です。",
        },
      ),
  });

export type newsCreateOnSubmitSchemaType = z.infer<
  typeof newsCreateOnSubmitSchema
>;

export const newsCreateOnSubmitSchemaDV: newsCreateOnSubmitSchemaType = {
  title: newsSchemaDV.title,
  detail: newsSchemaDV.detail,
  image: null,
  fromDate: newsSchemaDV.fromDate,
  toDate: newsSchemaDV.toDate,
  link: newsSchemaDV.link,
  createdUserId: newsSchemaDV.createdUserId,
};
