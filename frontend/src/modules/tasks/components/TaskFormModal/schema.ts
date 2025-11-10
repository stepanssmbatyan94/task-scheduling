import { z } from 'zod';

export type TaskFormValues = {
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  assignedUserId: string;
  statusId: string;
};

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export const buildTaskFormSchema = (t: TranslateFn) =>
  z
    .object({
      title: z
        .string()
        .trim()
        .min(1, {
          message: t('validation.required', { field: t('tasks.fields.title') })
        }),
      description: z
        .string()
        .trim()
        .max(1000, { message: t('validation.maxCharacters', { count: 1000 }) })
        .optional()
        .or(z.literal('')),
      startDate: z
        .string()
        .min(1, { message: t('validation.required', { field: t('tasks.fields.startDate') }) }),
      endDate: z
        .string()
        .min(1, { message: t('validation.required', { field: t('tasks.fields.endDate') }) }),
      assignedUserId: z
        .string()
        .min(1, {
          message: t('validation.required', { field: t('tasks.fields.assignedUser') })
        }),
      statusId: z
        .string()
        .min(1, {
          message: t('validation.required', { field: t('tasks.fields.status') })
        })
    })
    .superRefine((data, ctx) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: t('validation.invalidDate')
        });
        return;
      }

      if (end < start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: t('validation.endDateBeforeStartDate')
        });
      }
    });

