import {
  Button,
  Box,
  Flex,
  Select,
  TextField,
  Icon,
  Card,
} from '@backstage/ui';

import {
  AllowedEntityKinds,
  AllowedLifecycleStages,
  type CatalogInfoForm,
  type RequiredYamlFields,
} from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { formSchema } from '../../schemas/formSchema';
import { useState } from 'react';

export type CatalogFormProps = {
  onSubmit: (data: CatalogInfoForm[]) => void;
  currentYaml: RequiredYamlFields[] | null;
};

export const CatalogForm = ({ onSubmit, currentYaml }: CatalogFormProps) => {
  const [indexCount, setIndexCount] = useState<number>(
    currentYaml ? currentYaml.length : 0,
  );

  const incrementIndex = () => {
    setIndexCount(prev => prev + 1);
  };

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
              <Card
                style={{
                  marginRight: '1rem',
                  marginTop: '1rem',
                  padding: '1rem',
                }}
              >
                <Flex direction="column" justify="start" key={entity.key}>
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="Owner"
                          label="Entity owner"
                          isRequired
                        />
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
                        render={({ field }) => (
                          <TextField
                            {...field}
                            name="Entity type"
                            label="Entity type"
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          name="System"
                          label="Entity System"
                        />
                      )}
                    />
                    {errors.entities?.[index]?.system && (
                      <span style={{ color: 'red', fontSize: '0.75rem' }}>
                        {errors.entities?.[index]?.system.message}
                      </span>
                    )}
                  </div>
                </Flex>
              </Card>
            );
          })}
          <Flex direction="row" align="center" style={{ paddingTop: '1rem' }}>
            <Button
              type="button"
              onClick={() => {
                incrementIndex();
                append({
                  id: indexCount,
                  kind: AllowedEntityKinds.Component,
                  name: '',
                  owner: '',
                  lifecycle: AllowedLifecycleStages.production,
                  entityType: '',
                  system: '',
                });
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
