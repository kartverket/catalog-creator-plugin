import * as z from 'zod/v4';
import { AllowedEntityKinds, AllowedLifecycleStages } from '../model/types';

export const entitySchema = z.object({
  kind: z.enum(AllowedEntityKinds, { message: 'Choose a kind' }),
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
    .string()
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

export const formSchema = z.object({
  entities: z.array(entitySchema).min(1, 'At least one entity is required'),
});
