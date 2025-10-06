import * as z from 'zod/v4';
import { AllowedEntityKinds, AllowedLifecycleStages } from '../model/types';

export const componentSchema = z.object({
  id: z.number(),
  kind: z.literal('Component' as AllowedEntityKinds),
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
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),
});

export const apiSchema = z.object({
  id: z.number(),
  kind: z.literal('API' as AllowedEntityKinds),
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
  system: z.optional(
    z
      .string()
      .trim()
      .refine(s => !s.includes(' '), {
        message: 'System cannot contain space',
      }),
  ),
});

export type FormEntity = z.infer<typeof componentSchema | typeof apiSchema>;

export const entitySchema = z.union([componentSchema, apiSchema]);

export const formSchema = z.object({
  entities: z.array(entitySchema).min(1, 'At least one entity is required'),
});
