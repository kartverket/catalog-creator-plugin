import z from 'zod/v4';
import { RequiredYamlFields } from '../model/types.ts';
import yaml from 'yaml';
import { entitySchema } from '../schemas/formSchema.ts';

export const updateYaml = (
  initial: RequiredYamlFields,
  form: z.infer<typeof entitySchema>,
): string => {
  let updated: RequiredYamlFields;

  switch (form.kind) {
    case 'Component':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system: form.system?.length
            ? form.system
            : initial.spec.system || undefined,
          type: form.entityType! || initial.spec.type,
          providesApis: form.providesApis?.length
            ? form.providesApis
            : initial.spec.providesApis || undefined,
          consumesApis: form.consumesApis?.length
            ? form.consumesApis
            : initial.spec.consumesApis || undefined,
          dependsOn: form.dependsOn?.length
            ? form.dependsOn
            : initial.spec.dependsOn || undefined,
        },
      };
      break;
    case 'API':
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
        },
        spec: {
          ...initial.spec,
          owner: form.owner || initial.spec.owner || undefined,
          lifecycle: form.lifecycle || initial.spec.lifecycle || undefined,
          system: form.system?.length
            ? form.system
            : initial.spec.system || undefined,
          type: form.entityType! || initial.spec.type,
          definition: form.definition || initial.spec.definition,
        },
      };
      break;
    default:
      updated = {
        ...initial,
        kind: form.kind || initial.kind,
        metadata: {
          ...initial.metadata,
          name: form.name || initial.metadata.name,
        },
        spec: {
          ...initial.spec,
        },
      };
  }
  return yaml.stringify(updated);
};
