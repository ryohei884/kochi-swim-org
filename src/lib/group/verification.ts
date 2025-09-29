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

// groupMemberSchema
export const groupMemberSchema = z.object({
  groupId: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdUserId: z.string(),
  updatedUserId: z.string().nullable(),
});

export type groupMemberSchemaType = z.infer<typeof groupMemberSchema>;

export const groupMemberSchemaDV: groupMemberSchemaType = {
  groupId: "",
  userId: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  createdUserId: "",
  updatedUserId: "",
};

// groupSchema
export const groupSchema = z.object({
  id: z.string().nonoptional("グループIDを入力してください。"),
  name: z
    .string()
    .min(1, {
      message: "グループ名は1文字以上で入力してください。",
    })
    .max(128, {
      message: "グループ名は128文字以下で入力してください。",
    }),
  createdAt: z.date("日付を入力してください。"),
  updatedAt: z.date("日付を入力してください。"),
  createdUserId: z.string("作成者IDを入力してください。"),
  updatedUserId: z.string("更新者IDを入力してください。").nullable(),
});

export type groupSchemaType = z.infer<typeof groupSchema>;

export const groupSchemaDV: groupSchemaType = {
  id: "",
  name: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  createdUserId: "",
  updatedUserId: null,
};

// groupWithUserSchema
export const groupWithUserSchema = groupSchema.extend({
  createdUser: userSchema,
  updatedUser: userSchema.nullable(),
});

export type groupWithUserSchemaType = z.infer<typeof groupWithUserSchema>;

export const groupWithUserSchemaDV: groupWithUserSchemaType = {
  createdUser: userSchemaDV,
  updatedUser: null,
  ...groupSchemaDV,
};

// groupCreateSchema
export const groupCreateSchema = groupSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
});

export type groupCreateSchemaType = z.infer<typeof groupCreateSchema>;

export const groupCreateSchemaDV: groupCreateSchemaType = {
  name: groupSchemaDV.name,
};

// groupUpdateSchema
export const groupUpdateSchema = groupSchema.omit({
  createdAt: true,
  updatedAt: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type groupUpdateSchemaType = z.infer<typeof groupUpdateSchema>;

export const groupUpdateSchemaDV: groupUpdateSchemaType = {
  id: groupSchemaDV.id,
  name: groupSchemaDV.name,
  createdUserId: groupSchemaDV.createdUserId,
};

// groupGetByIdSchema
export const groupGetByIdSchema = groupSchema.omit({
  name: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type groupGetByIdSchemaType = z.infer<typeof groupGetByIdSchema>;

export const groupGetByIdSchemaDV: groupGetByIdSchemaType = {
  id: groupSchemaDV.id,
};

// groupExcludeSchema
export const groupExcludeSchema = groupSchema.omit({
  name: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type groupExcludeSchemaType = z.infer<typeof groupExcludeSchema>;

export const groupExcludeSchemaDV: groupExcludeSchemaType = {
  id: groupSchemaDV.id,
};

// memberSchema
export const memberSchema = groupSchema.omit({
  name: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type memberSchemaType = z.infer<typeof memberSchema>;

export const memberSchemaDV: memberSchemaType = {
  id: groupSchemaDV.id,
};

// updateMemberSchema
export const updateMemberSchema = z.object({
  users: z.array(z.string()).nullable(),
  id: z.string(),
});

export type updateMemberSchemaType = z.infer<typeof updateMemberSchema>;

export const updateMemberSchemaDV: updateMemberSchemaType = {
  users: [],
  id: "",
};

// memberListSchema
export const memberListSchema = {
  member_list: z.string().array(),
};

export type memberListSchemaType = z.infer<typeof memberListSchema>;

export const memberListSchemaDV: memberListSchemaType = {
  member_list: [],
};

// groupMemberFormSchema
export const groupMemberFormSchema = {
  member_list: memberListSchema,
  user_list: Array(userSchema),
};

export type groupMemberFormSchemaType = z.infer<typeof groupMemberFormSchema>;

export const groupMemberFormSchemaDV: groupMemberFormSchemaType = {
  member_list: [],
  user_list: [],
};

// groupMemberUpdateSchema
export const groupMemberUpdateSchema = groupMemberSchema.omit({
  createdUserId: true,
  updatedUserId: true,
  createdUser: true,
  updatedUser: true,
});

export type groupMemberUpdateSchemaType = z.infer<
  typeof groupMemberUpdateSchema
>;

export const groupMemberUpdateSchemaDV: groupMemberUpdateSchemaType = {
  createdAt: groupMemberSchemaDV.createdAt,
  updatedAt: groupMemberSchemaDV.updatedAt,
  groupId: groupMemberSchemaDV.groupId,
  userId: groupMemberSchemaDV.userId,
};

// userWithIsMemeberType
export const userWithIsMemeberSchema = userSchema.omit({
  image: true,
  updatedAt: true,
  role: true,
  email: true,
  emailVerified: true,
});

export type userWithIsMemeberType = z.infer<typeof userWithIsMemeberSchema>;

export const userWithIsMemeberDV: userWithIsMemeberType = {
  name: userSchemaDV.name,
  createdAt: userSchemaDV.createdAt,
  id: userSchemaDV.id,
};

// permissionSchema
export const permissionSchema = z.object({
  groupId: z.string().nonoptional("グループIDを入力してください。"),
  categoryId: z.string().nonoptional("カテゴリIDを入力してください。"),
  view: z.boolean(),
  submit: z.boolean(),
  revise: z.boolean(),
  exclude: z.boolean(),
  approve: z.boolean(),
  createdAt: z.date("日付を入力してください。"),
  updatedAt: z.date("日付を入力してください。").nullable(),
  createdUserId: z.string("作成者IDを入力してください。"),
  updatedUserId: z.string("更新者IDを入力してください。").nullable(),
});

export type permissionSchemaType = z.infer<typeof permissionSchema>;

export const permissionSchemaDV: permissionSchemaType = {
  groupId: "",
  categoryId: "",
  view: false,
  submit: false,
  revise: false,
  exclude: false,
  approve: false,
  createdAt: new Date(),
  updatedAt: null,
  createdUserId: "",
  updatedUserId: null,
};

// permissionGetSchema
export const permissionGetSchema = permissionSchema.omit({
  categoryId: true,
  view: true,
  submit: true,
  revise: true,
  exclude: true,
  approve: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  updatedUserId: true,
});

export type permissionGetSchemaType = z.infer<typeof permissionGetSchema>;

export const permissionGetSchemaDV: permissionGetSchemaType = {
  groupId: permissionSchemaDV.groupId,
};

// permissionUpdateSchema
export const permissionUpdateSchema = z.object({
  data: z.array(
    z.object({
      groupId: z.string(),
      categoryId: z.string(),
      permission: z.array(z.string().nullable()).nullable(),
    }),
  ),
});

export type permissionUpdateSchemaType = z.infer<typeof permissionUpdateSchema>;

export const permissionUpdateSchemaDV: permissionUpdateSchemaType = {
  data: [],
};
