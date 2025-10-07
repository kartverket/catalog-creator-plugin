import * as z from 'zod/v4';
import { AllowedLifecycleStages } from '../model/types';

const baseEntitySchema = z.object({
  id: z.number(),
  kind: z.string,
  name: z
    .string()
    .trim()
    .min(1, 'Add a name')
    .refine(s => !s.includes(' '), { message: 'Name cannot contain space' })
    .refine(
      s =>
        !/^[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]|[.!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/.test(
          s,
        ),
      'Name cannot start or end with special characters',
    ),
  owner: z
    .string()
    .trim()
    .min(1, 'Add an owner')
    .refine(s => !s.includes(' '), { message: 'Owner cannot contain space' }),
  lifecycle: z.enum(AllowedLifecycleStages, { message: 'Choose a lifecycle' }),
  entityType: z
    .string('Add a type')
    .trim()
    .min(1, 'Add a type')
    .refine(s => !s.includes(' '), { message: 'Type cannot contain space' }),
});

export const componentSchema = baseEntitySchema.extend({
  kind: z.literal('Component'),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),
  // providesApis: z
  //   .string()
  //   .transform(value => value.split(','))
  //   .pipe(z.array(z.string().trim()))
  //   .optional(),
  // consumesApis: z
  //   .string()
  //   .transform(value => value.split(','))
  //   .pipe(z.array(z.string().trim()))
  //   .optional(),
  // dependsOn: z
  //   .string()
  //   .transform(value => value.split(','))
  //   .pipe(z.array(z.string().trim()))
  //   .optional(),
});

export const apiSchema = baseEntitySchema.extend({
  kind: z.literal('API'),
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),
});

export const entitySchema = z.discriminatedUnion('kind', [
  componentSchema,
  apiSchema,
]);

export const formSchema = z.object({
  entities: z.array(entitySchema).min(1, 'At least one entity is required'),
});
