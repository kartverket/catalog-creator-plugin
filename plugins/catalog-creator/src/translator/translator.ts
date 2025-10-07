import z from 'zod/v4';
import { RequiredYamlFields } from '../model/types.ts';
import yaml from 'yaml';
import { entitySchema } from '../schemas/formSchema.ts';

export const updateYaml = (
  initial: RequiredYamlFields,
  form: z.infer<typeof entitySchema>,
): string => {
  const updated: RequiredYamlFields = {
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
    },
  };

  const yamlContent = yaml.stringify(updated);

  return yamlContent;
};
