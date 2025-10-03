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

// accountSchema
export const accountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_at: z.number().int().optional(),
  token_type: z.string().optional(),
  scope: z.string().optional(),
  id_token: z.string().optional(),
  session_state: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type accountSchemaType = z.infer<typeof accountSchema>;

export const accountSchemaDV: accountSchemaType = {
  userId: "",
  type: "",
  provider: "",
  providerAccountId: "",
  refresh_token: undefined,
  access_token: undefined,
  expires_at: undefined,
  token_type: undefined,
  scope: undefined,
  id_token: undefined,
  session_state: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// userWithAccountSchema
export const userWithAccountSchema = z.object({ userSchema, accountSchema });

export type userWithAccountSchemaType = z.infer<typeof userWithAccountSchema>;

export const userWithAccountSchemaDV: userWithAccountSchemaType = {
  userSchema: userSchemaDV,
  accountSchema: accountSchemaDV,
};

// contactSchema
export const contactSchema = z.object({
  lastName: z
    .string()
    .min(1, {
      message: "姓は1文字以上で入力してください。",
    })
    .max(16, {
      message: "姓は16文字以下で入力してください。",
    }),
  firstName: z
    .string()
    .min(1, {
      message: "名は1文字以上で入力してください。",
    })
    .max(16, {
      message: "名は16文字以下で入力してください。",
    }),
  affiliation: z
    .string()
    .min(1, {
      message: "本文は1文字以上で入力してください。",
    })
    .max(254, {
      message: "本文は254文字以下で入力してください。",
    }),
  email: z
    .string()
    .min(3, {
      message: "本文は3文字以上で入力してください。",
    })
    .max(254, {
      message: "本文は254文字以下で入力してください。",
    }),
  phone: z.string().optional(),
  message: z
    .string()
    .min(1, {
      message: "本文は1文字以上で入力してください。",
    })
    .max(500, {
      message: "本文は500文字以下で入力してください。",
    }),
});

export type contactSchemaType = z.infer<typeof contactSchema>;

export const contactSchemaDV: contactSchemaType = {
  firstName: "",
  lastName: "",
  email: "",
  affiliation: "",
  phone: "",
  message: "",
};
