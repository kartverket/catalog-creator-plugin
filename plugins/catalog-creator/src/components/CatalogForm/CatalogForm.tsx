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
import { useState } from 'react';
import { ComponentForm } from './Forms/ComponentForm';
import { ApiForm } from './Forms/ApiForm';

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
              kind: entry.kind as kind,
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
          />
        );
      case 'API':
        return (
          <ApiForm
            index={index}
            control={control}
            errors={errors?.entities?.[index] as EntityErrors<'API'>}
          />
        );
      default:
        return <p>No valid form kind was provided</p>;
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

          <Flex direction="row" align="center" style={{ paddingTop: '1rem' }}>
            <Select
              label="Entity kind"
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
            <Button variant="primary" type="submit">
              Create pull request
            </Button>
          </Flex>
        </Box>
      </form>
    </>
  );
};
