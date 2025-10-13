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

// seminarSchema
export const seminarSchema = z.object({
  id: z.string(),
  fromDate: z.date().nonoptional({
    error: "開始日は必須項目です。",
  }),
  toDate: z.date().nullable(),
  title: z
    .string()
    .min(2, {
      message: "大会名は2文字以上で入力してください。",
    })
    .max(128, {
      message: "大会名は128文字以下で入力してください。",
    }),
  deadline: z.date().nullable(),
  place: z.string(),
  description: z.string().nullable(),
  detail: z.string().nullable(),
  attachment: z.string().nullable(),
  createdUserId: z.string(),
  revisedUserId: z.string().nullable(),
  approvedUserId: z.string().nullable(),
  approved: z.boolean(),
  createdAt: z.date(),
  revisedAt: z.date(),
  approvedAt: z.date().nullable(),
});

export type seminarSchemaType = z.infer<typeof seminarSchema>;

export const seminarSchemaDV: seminarSchemaType = {
  id: "",
  fromDate: new Date(),
  toDate: null,
  title: "",
  deadline: null,
  place: "",
  description: null,
  detail: null,
  attachment: null,
  createdUserId: "",
  revisedUserId: "",
  approvedUserId: "",
  approved: false,
  createdAt: new Date(),
  revisedAt: new Date(),
  approvedAt: null,
};

// seminarWithUserSchema
export const seminarWithUserSchema = seminarSchema.extend({
  createdUser: userSchema,
  revisedUser: userSchema.nullable(),
  approvedUser: userSchema.nullable(),
});

export type seminarWithUserSchemaType = z.infer<typeof seminarWithUserSchema>;

export const seminarWithUserSchemaDV: seminarWithUserSchemaType = {
  ...seminarSchemaDV,
  createdUser: userSchemaDV,
  revisedUser: null,
  approvedUser: null,
};

// seminarCreateSchema
export const seminarCreateSchema = seminarSchema.omit({
  id: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  approved: true,
});

export type seminarCreateSchemaType = z.infer<typeof seminarCreateSchema>;

export const seminarCreateSchemaDV: seminarCreateSchemaType = {
  title: seminarSchemaDV.title,
  description: seminarSchemaDV.description,
  fromDate: seminarSchemaDV.fromDate,
  toDate: seminarSchemaDV.toDate,
  deadline: seminarSchemaDV.deadline,
  place: seminarSchemaDV.place,
  detail: seminarSchemaDV.detail,
  attachment: seminarSchemaDV.attachment,
};

// seminarCreateOnSubmitSchema
export const seminarCreateOnSubmitSchema = seminarSchema
  .omit({
    id: true,
    createdUserId: true,
    revisedUserId: true,
    approvedUserId: true,
    createdAt: true,
    revisedAt: true,
    approvedAt: true,
    approved: true,
  })
  .extend({
    detail: z.array(
      z.object({
        value: z.union([
          z.custom<FileList>(),
          z.string().optional(), // to hold default image
        ]),
        name: z.string(),
      }),
    ),
    attachment: z.array(
      z.object({
        value: z.union([
          z.custom<FileList>(),
          z.string().optional(), // to hold default image
        ]),
        name: z.string(),
      }),
    ),
  });

export type seminarCreateOnSubmitSchemaType = z.infer<
  typeof seminarCreateOnSubmitSchema
>;

export const seminarCreateOnSubmitSchemaDV: seminarCreateOnSubmitSchemaType = {
  title: seminarSchemaDV.title,
  fromDate: seminarSchemaDV.fromDate,
  place: seminarSchemaDV.place,
  toDate: seminarSchemaDV.toDate,
  deadline: seminarSchemaDV.deadline,
  description: seminarSchemaDV.description,
  detail: [{ value: "", name: "" }],
  attachment: [{ value: "", name: "" }],
};

// seminarUpdateOnSubmitSchema
export const seminarUpdateOnSubmitSchema = seminarSchema
  .omit({
    createdUserId: true,
    revisedUserId: true,
    approvedUserId: true,
    createdAt: true,
    revisedAt: true,
    approvedAt: true,
    approved: true,
    detail: true,
    attachment: true,
  })
  .extend({
    detail: z.array(
      z.object({
        value: z.union([
          z.custom<FileList>(),
          z.string().optional(), // to hold default image
        ]),
        name: z.string(),
      }),
    ),
    attachment: z.array(
      z.object({
        value: z.union([
          z.custom<FileList>(),
          z.string().optional(), // to hold default image
        ]),
        name: z.string(),
      }),
    ),
  });

export type seminarUpdateOnSubmitSchemaType = z.infer<
  typeof seminarUpdateOnSubmitSchema
>;

export const seminarUpdateOnSubmitSchemaDV: seminarUpdateOnSubmitSchemaType = {
  id: seminarSchemaDV.id,
  title: seminarSchemaDV.title,
  fromDate: seminarSchemaDV.fromDate,
  place: seminarSchemaDV.place,
  toDate: seminarSchemaDV.toDate,
  deadline: seminarSchemaDV.deadline,
  description: seminarSchemaDV.description,
  detail: [{ value: "", name: "" }],
  attachment: [{ value: "", name: "" }],
};

// seminarGetByIdSchema
export const seminarGetByIdSchema = seminarSchema.omit({
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  description: true,
  detail: true,
  attachment: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
});

export type seminarGetByIdSchemaType = z.infer<typeof seminarGetByIdSchema>;

export const seminarGetByIdSchemaDV: seminarGetByIdSchemaType = {
  id: seminarSchemaDV.id,
};

// seminarUpdateSchema
export const seminarUpdateSchema = seminarSchema.omit({
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  approved: true,
});

export type seminarUpdateSchemaType = z.infer<typeof seminarUpdateSchema>;

export const seminarUpdateSchemaDV: seminarUpdateSchemaType = {
  id: seminarSchemaDV.id,
  title: seminarSchemaDV.title,
  description: seminarSchemaDV.description,
  fromDate: seminarSchemaDV.fromDate,
  toDate: seminarSchemaDV.toDate,
  deadline: seminarSchemaDV.deadline,
  place: seminarSchemaDV.place,
  detail: seminarSchemaDV.detail,
  attachment: seminarSchemaDV.attachment,
};

// seminarExcludeSchema
export const seminarExcludeSchema = seminarSchema.omit({
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  description: true,
  detail: true,
  attachment: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
});

export type seminarExcludeSchemaType = z.infer<typeof seminarExcludeSchema>;

export const seminarExcludeSchemaDV: seminarExcludeSchemaType = {
  id: seminarSchemaDV.id,
};

// seminarApproveSchema
export const seminarApproveSchema = seminarSchema.omit({
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  description: true,
  detail: true,
  attachment: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  approved: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
});

export type seminarApproveSchemaType = z.infer<typeof seminarApproveSchema>;

export const seminarApproveSchemaDV: seminarApproveSchemaType = {
  id: seminarSchemaDV.id,
};
