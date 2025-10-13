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
