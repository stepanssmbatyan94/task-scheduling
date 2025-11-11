import { z } from 'zod';

const idSchema = z.union([z.string(), z.number()]).refine(
  (value) => {
    const numeric = Number(value);
    return !Number.isNaN(numeric) && numeric > 0;
  },
  { message: 'Invalid selection.' }
);

export const createUserValidationSchema = z
  .object({
    firstName: z
      .string({ message: 'First name is required.' })
      .min(1, { message: 'First name is required.' })
      .max(50, { message: 'First name must be no more than 50 characters long.' }),
    lastName: z
      .string({ message: 'Last name is required.' })
      .min(1, { message: 'Last name is required.' })
      .max(50, { message: 'Last name must be no more than 50 characters long.' }),
    email: z
      .string({ message: 'E-mail is required.' })
      .email({ message: 'Please provide a valid e-mail address.' })
      .max(100, { message: 'E-mail must be no more than 100 characters long.' }),
    password: z
      .string({ message: 'Password is required.' })
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .max(50, { message: 'Password must be no more than 50 characters long.' }),
    confirmPassword: z
      .string({ message: 'Confirm password is required.' })
      .min(6, { message: 'Confirm password must be at least 6 characters long.' })
      .max(50, { message: 'Confirm password must be no more than 50 characters long.' }),
    roleId: idSchema,
    statusId: idSchema.nullish()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don\'t match.',
    path: ['confirmPassword']
  });

export const updateUserValidationSchema = z.object({
  firstName: z
    .string({ message: 'First name is required.' })
    .min(1, { message: 'First name is required.' })
    .max(50, { message: 'First name must be no more than 50 characters long.' }),
  lastName: z
    .string({ message: 'Last name is required.' })
    .min(1, { message: 'Last name is required.' })
    .max(50, { message: 'Last name must be no more than 50 characters long.' }),
  email: z
    .string({ message: 'E-mail is required.' })
    .email({ message: 'Please provide a valid e-mail address.' })
    .max(100, { message: 'E-mail must be no more than 100 characters long.' }),
  password: z
    .string()
    .max(50, { message: 'Password must be no more than 50 characters long.' })
    .optional()
    .or(z.literal(''))
    .transform((value) => (value === '' ? undefined : value)),
  roleId: idSchema,
  statusId: idSchema.nullish()
});
