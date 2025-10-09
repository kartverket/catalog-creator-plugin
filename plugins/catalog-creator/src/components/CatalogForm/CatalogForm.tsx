import { Button, Box, Flex, Select, Icon, Card } from '@backstage/ui';

import type {
  EntityErrors,
  FormEntity,
  kind,
  RequiredYamlFields,
} from '../../model/types';
import { AllowedLifecycleStages, AllowedEntityKinds } from '../../model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { entitySchema, formSchema } from '../../schemas/formSchema';
import { ComponentForm } from './Forms/ComponentForm';
import { ApiForm } from './Forms/ApiForm';
import useAsync from 'react-use/esm/useAsync';

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { useState } from 'react';

export type CatalogFormProps = {
  onSubmit: (data: FormEntity[]) => void;
  currentYaml: RequiredYamlFields[] | null;
};

export const CatalogForm = ({ onSubmit, currentYaml }: CatalogFormProps) => {
  const catalogApi = useApi(catalogApiRef);

  const fetchOwners = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'group',
      },
    });

    return results.items as Entity[];
  }, [catalogApi]);

  const fetchSystems = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'system',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

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
              kind: entry.kind as kind,
              name: entry.metadata.name,
              owner: entry.spec.owner,
              lifecycle: entry.spec.lifecycle as AllowedLifecycleStages,
              entityType: entry.spec.type as string,
              system: entry.spec.system,
              providesApis: entry.spec.providesApis,
              consumesApis: entry.spec.consumesApis,
              dependencyOf: entry.spec.dependencyOf,
            };
          })
        : [
            {
              id: 0,
              kind: 'Component',
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
  const [addEntityKind, setAddEntityKind] = useState<kind>('Component');

  const appendHandler = () => {
    let entity: z.infer<typeof entitySchema>;
    switch (addEntityKind) {
      case 'Component' as kind:
        entity = {
          id: indexCount,
          kind: addEntityKind,
          name: '',
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: 'library',
          system: '',
        };
        break;
      default:
        entity = {
          id: indexCount,
          kind: addEntityKind,
          name: '',
          owner: '',
          lifecycle: AllowedLifecycleStages.production,
          entityType: 'library',
          system: '',
        };
    }
    setIndexCount(prev => prev + 1);
    append(entity);
  };

  const getEntityForm = (
    entity: z.infer<typeof entitySchema>,
    index: number,
  ) => {
    switch (entity.kind) {
      case 'Component':
        return (
          <ComponentForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'Component'>}
            owners={fetchOwners.value || []}
            systems={fetchSystems.value || []}
          />
        );
      case 'API':
        return (
          <ApiForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'API'>}
            owners={fetchOwners.value || []}
            systems={fetchSystems.value || []}
          />
        );
      default:
        return <p>A form for this kind does not exist</p>;
    }
  };

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
                        render={({ field: { value } }) => (
                          <h3 aria-label="entity-header">
                            {' '}
                            {`${value} Entity`}{' '}
                          </h3>
                        )}
                      />
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
                  {getEntityForm(entity, index)}
                </Flex>
              </Card>
            );
          })}

          <Flex
            direction="row"
            align="end"
            justify="between"
            style={{ paddingTop: '1rem' }}
          >
            <Flex align="end">
              <Select
                label="Select entity kind"
                selectedKey={addEntityKind}
                onSelectionChange={value => setAddEntityKind(value as kind)}
                options={Object.values(AllowedEntityKinds).map(
                  lifecycleStage => ({
                    value: lifecycleStage as string,
                    label: lifecycleStage,
                  }),
                )}
              />
              <Button type="button" onClick={() => appendHandler()}>
                Add Entity
              </Button>
            </Flex>
            <Button variant="primary" type="submit">
              Create pull request
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};
