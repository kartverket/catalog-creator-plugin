import type { CatalogInfoForm, RequiredYamlFields } from '../model/types.ts';
import yaml from 'yaml';

export const updateYaml = (initial: RequiredYamlFields, form: CatalogInfoForm): string => {

    

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
            system: form.system?.length ? form.system : initial.spec.system || undefined,
            domain: form.domain?.length ? form.domain : initial.spec.domain || undefined,
            providesApis: form.providesApis?.length ? form.providesApis : initial.spec.providesApis || undefined,
            consumesApis: form.consumesApis?.length ? form.consumesApis : initial.spec.consumesApis || undefined,
            dependsOn: form.dependsOn?.length ? form.dependsOn : initial.spec.consumesApis || undefined,
            definition: form.definition?.length ? form.definition : initial.spec.definition || undefined,
            type: form.entityType! || initial.spec.type,
        }
    };

    

    const yamlContent = yaml.stringify(updated);

    return yamlContent;
};