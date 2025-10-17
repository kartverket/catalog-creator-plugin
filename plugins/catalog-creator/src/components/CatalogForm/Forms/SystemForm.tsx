import { Flex, TextField } from '@backstage/ui';
import { Control, Controller } from 'react-hook-form';
import { EntityErrors } from '../../../model/types';
import { formSchema } from '../../../schemas/formSchema';
import z from 'zod/v4';
import { Entity } from '@backstage/catalog-model';
import CatalogSearch from '../../CatalogSearch';
import { useAsync } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

export type SystemFormProps = {
  index: number;
  control: Control<z.infer<typeof formSchema>>;
  errors: EntityErrors<'System'>;
  owners: Entity[];
};

export const SystemForm = ({ index, control, errors }: SystemFormProps) => {
  const catalogApi = useApi(catalogApiRef);
  const fetchDomains = useAsync(async () => {
    const results = await catalogApi.getEntities({
      filter: {
        kind: 'Domain',
      },
    });
    return results.items as Entity[];
  }, [catalogApi]);

  return (
    <Flex direction="column" justify="start">
      <Flex>
        <div style={{ flexGrow: 1 }}>
          <Controller
            name={`entities.${index}.entityType`}
            control={control}
            render={({ field }) => (
              <TextField {...field} name="Entity type" label="Entity type" />
            )}
          />

          <span
            style={{
              color: 'red',
              fontSize: '0.75rem',
              visibility: errors?.entityType ? 'visible' : 'hidden',
            }}
          >
            {errors?.entityType?.message || '\u00A0'}
          </span>
        </div>
      </Flex>
      <div>
        <Controller
          name={`entities.${index}.domain`}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <CatalogSearch
              onChange={onChange}
              onBlur={onBlur}
              label="Entity domain"
              value={value}
              isRequired={false}
              entityList={fetchDomains.value || []}
            />
          )}
        />

        <span
          style={{
            color: 'red',
            fontSize: '0.75rem',
            visibility: errors?.domain ? 'visible' : 'hidden',
          }}
        >
          {errors?.domain?.message || '\u00A0'}
        </span>
      </div>
    </Flex>
  );
};
