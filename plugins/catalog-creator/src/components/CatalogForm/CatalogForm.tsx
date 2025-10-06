import {
  Button,
  Box,
  Flex,
  Select,
  TextField,
  Icon,
  Card,
} from '@backstage/ui';

import type { RequiredYamlFields } from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityKinds } from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { FormEntity, formSchema } from '../../schemas/formSchema';
import { useState } from 'react';
import { CatalogSearch } from '../CatalogSearch';

export type CatalogFormProps = {
  onSubmit: (data: FormEntity[]) => void;
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
        ? currentYaml.map((entry: RequiredYamlFields, index) => {
            return {
              id: index,
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
              id: 0,
              kind: AllowedEntityKinds.Component,
              name: '',
              owner: '',
            },
          ],
    },
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'entities',
    keyName: 'key',
    control,
  });
  const [indexCount, setIndexCount] = useState(fields.length);

  return (
    <>
      <form
        onSubmit={handleSubmit(data => {
          onSubmit(data.entities as FormEntity[]);
        })}
      >
        <Box px="2rem">
          <h2>Catalog-info.yaml Form</h2>
          {fields.map((entity, index) => {
            return (
              <Card
                style={{
                  marginRight: '1rem',
                  marginTop: '1rem',
                  padding: '1rem',
                  position: 'relative',
                  overflow: 'visible',
                }}
                key={entity.key}
              >
                <Flex direction="column" justify="start">
                  <Flex justify="between">
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
                    {index !== 0 && (
                      <Button
                        style={{ width: '40px', alignSelf: 'flex-end' }}
                        onClick={() => remove(index)}
                      >
                        <Icon name="trash" />
                      </Button>
                    )}
                  </Flex>
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

                    <span
                      style={{
                        color: 'red',
                        fontSize: '0.75rem',
                        visibility: errors.entities?.[index]?.name
                          ? 'visible'
                          : 'hidden',
                      }}
                    >
                      {errors.entities?.[index]?.name?.message || '\u00A0'}
                    </span>
                  </div>
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <Controller
                      name={`entities.${index}.owner`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CatalogSearch
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          label="Entity owner"
                          filter="group"
                          isRequired
                        />
                      )}
                    />

                    <span
                      style={{
                        color: 'red',
                        fontSize: '0.75rem',
                        visibility: errors.entities?.[index]?.owner
                          ? 'visible'
                          : 'hidden',
                      }}
                    >
                      {errors.entities?.[index]?.owner?.message || '\u00A0'}
                    </span>
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

                      <span
                        style={{
                          color: 'red',
                          fontSize: '0.75rem',
                          visibility: errors.entities?.[index]?.lifecycle
                            ? 'visible'
                            : 'hidden',
                        }}
                      >
                        {errors.entities?.[index]?.lifecycle?.message ||
                          '\u00A0'}
                      </span>
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <Controller
                        name={`entities.${index}.entityType`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            name="Entity type"
                            label="Entity type"
                            isRequired
                          />
                        )}
                      />

                      <span
                        style={{
                          color: 'red',
                          fontSize: '0.75rem',
                          visibility: errors.entities?.[index]?.entityType
                            ? 'visible'
                            : 'hidden',
                        }}
                      >
                        {errors.entities?.[index]?.entityType?.message ||
                          '\u00A0'}
                      </span>
                    </div>
                  </Flex>
                  <div style={{ position: 'relative', overflow: 'visible' }}>
                    <Controller
                      name={`entities.${index}.system`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <CatalogSearch
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          label="Entity system"
                          filter="system"
                          isRequired={false}
                        />
                      )}
                    />

                    <span
                      style={{
                        color: 'red',
                        fontSize: '0.75rem',
                        visibility: errors.entities?.[index]?.system
                          ? 'visible'
                          : 'hidden',
                      }}
                    >
                      {errors.entities?.[index]?.system?.message || '\u00A0'}
                    </span>
                  </div>
                </Flex>
              </Card>
            );
          })}

          <Flex direction="row" align="center" style={{ paddingTop: '1rem' }}>
            <Button
              type="button"
              onClick={() => {
                append({
                  id: indexCount,
                  kind: AllowedEntityKinds.Component,
                  name: '',
                  owner: '',
                  lifecycle: AllowedLifecycleStages.production,
                  entityType: 'library',
                  system: '',
                });
                setIndexCount(prev => prev + 1);
              }}
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
