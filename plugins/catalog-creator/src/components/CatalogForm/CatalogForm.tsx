import { Button, Box, Flex, Select, TextField } from '@backstage/ui';

import type { CatalogInfoForm, RequiredYamlFields } from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityKinds } from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { formSchema } from '../../schemas/formSchema';
import Divider from '@mui/material/Divider';
import { CatalogSearch } from '../CatalogSearch';

export type CatalogFormProps = {
  onSubmit: (data: CatalogInfoForm[]) => void;
  currentYaml: RequiredYamlFields[] | null;
};

export const CatalogForm = ({ onSubmit, currentYaml }: CatalogFormProps) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      entities: currentYaml
        ? currentYaml.map((entry: RequiredYamlFields) => {
            return {
              kind: entry.kind as AllowedEntityKinds,
              name: entry.metadata.name,
              owner: entry.spec.owner,
              lifecycle: entry.spec.lifecycle as AllowedLifecycleStages,
              entityType: entry.spec.type as string,
              system: entry.spec.system,
            };
          })
        : [
            {
              kind: AllowedEntityKinds.Component,
              name: '',
              owner: '',
            },
          ],
    },
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const { fields, append } = useFieldArray({
    name: 'entities',
    control,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data.entities as CatalogInfoForm[]);
        })}
      >
        <Box px="2rem">
          <h2>Catalog-info.yaml Form</h2>
          {fields.map((entity, index) => {
            return (
              <Flex direction="column" justify="start" key={entity.id}>
                {index !== 0 && <Divider variant="middle" sx={{ mt: 3 }} />}
                <div>
                  <Controller
                    name={`entities.${index}.kind`}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Select
                        name="kind"
                        label="Entity kind"
                        onBlur={onBlur}
                        onSelectionChange={onChange}
                        selectedKey={value}
                        options={Object.values(AllowedEntityKinds).map(
                          entityKind => ({
                            value: entityKind as string,
                            label: entityKind,
                          }),
                        )}
                        isRequired
                        isDisabled={index === 0}
                      />
                    )}
                  />
                  {errors.entities?.[index]?.kind && (
                    <span style={{ color: 'red', fontSize: '0.75rem' }}>
                      {errors.entities?.[index]?.kind.message}
                    </span>
                  )}
                </div>
                <div>
                  <Controller
                    name={`entities.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        name="Name"
                        label="Entity name"
                        isRequired
                      />
                    )}
                  />
                  {errors.entities?.[index]?.name && (
                    <span style={{ color: 'red', fontSize: '0.75rem' }}>
                      {errors.entities?.[index]?.name.message}
                    </span>
                  )}
                </div>
                <div>
                  <Controller
                    name={`entities.${index}.owner`}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <CatalogSearch
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          label="Owner"
                          filter="group"
                        />
                      </>
                    )}
                  />
                  {errors.entities?.[index]?.owner && (
                    <span style={{ color: 'red', fontSize: '0.75rem' }}>
                      {errors.entities?.[index]?.owner.message}
                    </span>
                  )}
                </div>

                <Flex>
                  <div>
                    <Controller
                      name={`entities.${index}.lifecycle`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Select
                          name="lifecycle"
                          label="Entity lifecycle"
                          onBlur={onBlur}
                          onSelectionChange={onChange}
                          selectedKey={value}
                          options={Object.values(AllowedLifecycleStages).map(
                            lifecycleStage => ({
                              value: lifecycleStage as string,
                              label: lifecycleStage,
                            }),
                          )}
                          isRequired
                        />
                      )}
                    />
                    {errors.entities?.[index]?.lifecycle && (
                      <span style={{ color: 'red', fontSize: '0.75rem' }}>
                        {errors.entities?.[index]?.lifecycle.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Controller
                      name={`entities.${index}.entityType`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Select
                          name="type"
                          label="Entity type"
                          onBlur={onBlur}
                          onSelectionChange={onChange}
                          defaultSelectedKey={value}
                          options={Object.values(AllowedEntityKinds).map(
                            entityKind => ({
                              value: entityKind as string,
                              label: entityKind,
                            }),
                          )}
                          isRequired
                        />
                      )}
                    />
                    {errors.entities?.[index]?.entityType && (
                      <span style={{ color: 'red', fontSize: '0.75rem' }}>
                        {errors.entities?.[index]?.entityType.message}
                      </span>
                    )}
                  </div>
                </Flex>
                <div>
                  <Controller
                    name={`entities.${index}.system`}
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <CatalogSearch
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          label="System"
                          filter="system"
                        />
                      </>
                    )}
                  />
                  {errors.entities?.[index]?.system && (
                    <span style={{ color: 'red', fontSize: '0.75rem' }}>
                      {errors.entities?.[index]?.system.message}
                    </span>
                  )}
                </div>
              </Flex>
            );
          })}
          <Flex direction="row" align="center" style={{ paddingTop: '1rem' }}>
            <Button
              type="button"
              onClick={() =>
                append({
                  kind: AllowedEntityKinds.Component,
                  name: '',
                  owner: '',
                  lifecycle: AllowedLifecycleStages.production,
                  entityType: 'library',
                  system: '',
                })
              }
            >
              Add Entity
            </Button>
            <Button variant="primary" type="submit">
              Create pull request
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};
