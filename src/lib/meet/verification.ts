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

// meetSchema
export const meetSchema = z.object({
  id: z.string(),
  code: z.string().nullable(),
  kind: z.number().int(),
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
  poolsize: z.number().int(),
  result: z.boolean(),
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

export type meetSchemaType = z.infer<typeof meetSchema>;

export const meetSchemaDV: meetSchemaType = {
  id: "",
  code: "",
  kind: 1,
  fromDate: new Date(),
  toDate: null,
  title: "",
  deadline: null,
  place: "",
  poolsize: 0,
  result: false,
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

// meetWithUserSchema
export const meetWithUserSchema = meetSchema.extend({
  createdUser: userSchema,
  revisedUser: userSchema.nullable(),
  approvedUser: userSchema.nullable(),
});

export type meetWithUserSchemaType = z.infer<typeof meetWithUserSchema>;

export const meetWithUserSchemaDV: meetWithUserSchemaType = {
  ...meetSchemaDV,
  createdUser: userSchemaDV,
  revisedUser: null,
  approvedUser: null,
};

// meetCreateSchema
export const meetCreateSchema = meetSchema.omit({
  id: true,
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  approved: true,
});

export type meetCreateSchemaType = z.infer<typeof meetCreateSchema>;

export const meetCreateSchemaDV: meetCreateSchemaType = {
  result: meetSchemaDV.result,
  title: meetSchemaDV.title,
  description: meetSchemaDV.description,
  code: meetSchemaDV.code,
  kind: meetSchemaDV.kind,
  fromDate: meetSchemaDV.fromDate,
  toDate: meetSchemaDV.toDate,
  deadline: meetSchemaDV.deadline,
  place: meetSchemaDV.place,
  poolsize: meetSchemaDV.poolsize,
  detail: meetSchemaDV.detail,
  attachment: meetSchemaDV.attachment,
};

// meetCreateOnSubmitSchema
export const meetCreateOnSubmitSchema = meetSchema
  .omit({
    id: true,
    createdUserId: true,
    revisedUserId: true,
    approvedUserId: true,
    createdAt: true,
    revisedAt: true,
    approvedAt: true,
    approved: true,
    poolsize: true,
    kind: true,
  })
  .extend({
    poolsize: z.string().nullable(),
    kind: z.string(),
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

export type meetCreateOnSubmitSchemaType = z.infer<
  typeof meetCreateOnSubmitSchema
>;

export const meetCreateOnSubmitSchemaDV: meetCreateOnSubmitSchemaType = {
  title: meetSchemaDV.title,
  fromDate: meetSchemaDV.fromDate,
  result: meetSchemaDV.result,
  kind: String(meetSchemaDV.kind),
  place: meetSchemaDV.place,
  poolsize: String(meetSchemaDV.poolsize),
  code: meetSchemaDV.code,
  toDate: meetSchemaDV.toDate,
  deadline: meetSchemaDV.deadline,
  description: meetSchemaDV.description,
  detail: [{ value: "", name: "" }],
  attachment: [{ value: "", name: "" }],
};

// meetUpdateOnSubmitSchema
export const meetUpdateOnSubmitSchema = meetSchema
  .omit({
    createdUserId: true,
    revisedUserId: true,
    approvedUserId: true,
    createdAt: true,
    revisedAt: true,
    approvedAt: true,
    approved: true,
    poolsize: true,
    kind: true,
    detail: true,
    attachment: true,
  })
  .extend({
    poolsize: z.string().nullable(),
    kind: z.string(),
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

export type meetUpdateOnSubmitSchemaType = z.infer<
  typeof meetUpdateOnSubmitSchema
>;

export const meetUpdateOnSubmitSchemaDV: meetUpdateOnSubmitSchemaType = {
  id: meetSchemaDV.id,
  title: meetSchemaDV.title,
  fromDate: meetSchemaDV.fromDate,
  result: meetSchemaDV.result,
  kind: String(meetSchemaDV.kind),
  place: meetSchemaDV.place,
  poolsize: String(meetSchemaDV.poolsize),
  code: meetSchemaDV.code,
  toDate: meetSchemaDV.toDate,
  deadline: meetSchemaDV.deadline,
  description: meetSchemaDV.description,
  detail: [{ value: "", name: "" }],
  attachment: [{ value: "", name: "" }],
};

// meetGetByIdSchema
export const meetGetByIdSchema = meetSchema.omit({
  code: true,
  kind: true,
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  poolsize: true,
  result: true,
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

export type meetGetByIdSchemaType = z.infer<typeof meetGetByIdSchema>;

export const meetGetByIdSchemaDV: meetGetByIdSchemaType = {
  id: meetSchemaDV.id,
};

// meetUpdateSchema
export const meetUpdateSchema = meetSchema.omit({
  createdUserId: true,
  revisedUserId: true,
  approvedUserId: true,
  createdAt: true,
  revisedAt: true,
  approvedAt: true,
  approved: true,
});

export type meetUpdateSchemaType = z.infer<typeof meetUpdateSchema>;

export const meetUpdateSchemaDV: meetUpdateSchemaType = {
  id: meetSchemaDV.id,
  result: meetSchemaDV.result,
  title: meetSchemaDV.title,
  description: meetSchemaDV.description,
  code: meetSchemaDV.code,
  kind: meetSchemaDV.kind,
  fromDate: meetSchemaDV.fromDate,
  toDate: meetSchemaDV.toDate,
  deadline: meetSchemaDV.deadline,
  place: meetSchemaDV.place,
  poolsize: meetSchemaDV.poolsize,
  detail: meetSchemaDV.detail,
  attachment: meetSchemaDV.attachment,
};

// meetExcludeSchema
export const meetExcludeSchema = meetSchema.omit({
  code: true,
  kind: true,
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  poolsize: true,
  result: true,
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

export type meetExcludeSchemaType = z.infer<typeof meetExcludeSchema>;

export const meetExcludeSchemaDV: meetExcludeSchemaType = {
  id: meetSchemaDV.id,
};

// meetApproveSchema
export const meetApproveSchema = meetSchema.omit({
  code: true,
  kind: true,
  fromDate: true,
  toDate: true,
  title: true,
  deadline: true,
  place: true,
  poolsize: true,
  result: true,
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

export type meetApproveSchemaType = z.infer<typeof meetApproveSchema>;

export const meetApproveSchemaDV: meetApproveSchemaType = {
  id: meetSchemaDV.id,
};
